let Genre = require("../models/music_genre");

let Album = require("../models/music_album");

let async = require("async");

let {body, validationResult} = require("express-validator")

let genres_list = (req, res, next) => {
    async.parallel(
        {
            genres(cb) {
                // passing in empty object means match everything
                Genre.find({}).exec(cb)
            },

            async genres_albums(cb) {
                let genresPromises = Album.find({})
                .then(albums => {
                    let promises = albums?.flatMap(album => album?.genre.map(id => Genre.findById(id)))
                    return Promise.all(promises)
                }).catch(err => next(err))

                return genresPromises.then(genres => {
                    let albumsGenreCount = {"R&B": 0, "Rock": 0}
                    genres?.forEach(genre => albumsGenreCount[genre.name] = albumsGenreCount[genre.name] == null ? 0 : albumsGenreCount[genre.name] != null ? albumsGenreCount[genre.name] + 1 : 1)
                    // console.log(albumsGenreCount, "<<albums>>")
                    return albumsGenreCount
                })
            }
        },

        (err, results) => {
            if(err) return next(err)

            // if there is no album found in any of thes genres then simply add a "0" to them for smoother view in ejs
            let keys = Object.keys(results.genres_albums)
            results.genres?.forEach(genre => {
                if(!keys.includes(genre.name)) {
                    results.genres_albums[genre.name] = 0;
                }
            })

            // console.log(results, "<<?>?><><>")

            res.render("all-genres", {
                title: "List Of All Genres",
                genres: results.genres,
                genres_albums: results.genres_albums
            })
        }
    )
}


let genre_detail = (req, res, next) => {
    async.parallel(
        {
            genre(cb) {
                Genre.findById(req.params.id).exec(cb)
            },

            async albums(cb) {
                // return Album.find().populate("name").populate("artist")
                return Album.find()
                .then((albms) => {
                    let count = 0;
                    let g_albums = []
                    
                    albms?.forEach(item => {
                        item?.genre.forEach(id => {
                            count = id == req.params.id ? count + 1 : count
                            id == req.params.id ? g_albums.push({name: item.name, id: item._id, artist: item.artist._id}) : null
                        })
                    })

                    return {count, g_albums}
                }).catch(err => next(err))
            }
        },

        (err, results) => {
            if(err) return next(err);

            // console.log(results, "<<results>>");
            // res.send("test test")
            res.render("genre_detail", {
                title: results.genre?.name,
                genre: results.genre,
                genre_albums: results.albums.g_albums
            })
        }
    )
}

let genre_create_get = (req, res) => {
    res.render("form_genre", {title: "Cerate Genre", genre: null, errors: null, update_flag: false})
}

let genre_create_post = [
    body("name", "Name field must not be empty")
    .trim().isLength({min: 1}).escape(),
    body("name", "Name filed value must be more than or equal to three characters")
    .trim().isLength({min: 3}).escape(),

    (req, res, next) => {
        let errors = validationResult(req)

        let genre = new Genre({name: req.body.name, cover_img: req.file?.buffer})

        if(!errors.isEmpty()) {
            res.render("form_genre", {
                title: "Cerate Genre", 
                genre: genre, 
                errors: errors.array(),
                update_flag: false
            })
            return
        }

        // successful, so lets show genre detail for this entry
        genre.save(err => {
            if(err) return next(err);

            res.redirect(genre.url)
        })
    }
]

let genre_delete_get = (req, res, next) => {
    async.parallel(
        {
            async albums(cb) {
                return Album.find()
                .then(items => {
                    let genrePromises = items?.flatMap(item => item.genre?.map(id => id.toString() === req.params.id ? item : false)).filter(id => id)
                    return Promise.all(genrePromises)
                })
            },

            genre(cb) {
                Genre.findById(req.params.id).exec(cb)
            }
        },

        (err, results) => {
            if(err) return next(err);

            // console.log(results, "<<results>>")

            res.render("delete_genre", {
                title: "Delete Genre",
                genre: results.genre,
                albums: results.albums,
                errors: null
            })
        }
    )
}

let genre_delete_post = [
    body("admin_code", "Admin Code can not be empty")
    .trim().isLength({min: 2}).escape(),
    body("admin_code", "Code does not match with secret")
    .trim().equals("1234").escape(),

    (req, res, next) => {
        let errors = validationResult(req);

        let genreid = req.body.genreid;

        if(!errors.isEmpty()) {
            async.parallel(
                {
                    async albums(cb) {
                        return Album.find()
                        .then(items => {
                            let genrePromises = items?.flatMap(item => item.genre?.map(id => id.toString() === genreid ? item : false)).filter(id => id)
                            return Promise.all(genrePromises)
                        })
                    },
        
                    genre(cb) {
                        Genre.findById(genreid).exec(cb)
                    }
                },
        
                (err, results) => {
                    if(err) return next(err);
        
                    // console.log(results, "<<results>>")
        
                    res.render("delete_genre", {
                        title: "Delete Genre",
                        genre: results.genre,
                        albums: results.albums,
                        errors: errors.array()
                    })
                }
            )
            return
        }

        Genre.findByIdAndDelete(genreid)
        .then(() => console.log("genre deleted"))
        .catch(err => next(err))
        .finally(() => res.redirect("/catalog/genres"))
    }
]

let genre_update_get = (req, res, next) => {
    async.parallel(
        {
            genre(cb) {
                Genre.findById(req.params.id).exec(cb)
            }
        },

        (err, results) => {
            if(err) return next(err);
            
            res.render("form_genre", {
                title: "Update Genre",
                genre: results.genre,
                errors: null,
                update_flag: true
            })
        }
    )
}

let genre_update_post = [
    body("name", "Name field can not be left empty")
    .trim().isLength({min: 1}).escape(),
    body("admin_code", "Admin Code can not be empty")
    .trim().isLength({min: 1}).escape(),
    body("admin_code", "Code does not match with secret")
    .trim().equals("1234").escape(),
    
    (req, res, next) => {
        let errors = validationResult(req);

        let genre = new Genre({name: req.body.name, cover_img: req.file?.buffer, _id: req.params.id})

        if(!errors.isEmpty()) {
            res.render("form_genre", {
                title: "Update Genre",
                genre: genre,
                errors: errors.array(),
                update_flag: true
            })

            return
        }

        // otherwise successful, we'll update and redirect to its detail page
        Genre.findByIdAndUpdate(req.params.id, genre, {}, err=> {
            if(err) return next(err);

            res.redirect(genre.url)
        })
    }
]

module.exports = {
    genres_list,
    genre_detail,
    genre_create_get,
    genre_create_post,
    genre_delete_get,
    genre_delete_post,
    genre_update_get,
    genre_update_post
}