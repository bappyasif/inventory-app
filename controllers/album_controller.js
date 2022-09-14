let prompt = require("prompt")
let prompt2 = require("prompt-sync")()
let async = require("async")
let Album = require("../models/music_album");
let Artist = require("../models/music_artist");
let Genre = require("../models/music_genre");
let Track = require("../models/music_track");
let {body, validationResult} = require("express-validator");
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * 
 */
let albums_list = (req, res, next) => {
    async.series(
        {
            albums(cb) {
                Album.find({}).populate("name").populate("artist").exec(cb)
            },
        },

        (err, results) => {
            if (err) return next(err);

            res.render("all-albums", {
                title: "All Albums",
                results: results.albums
            })
        }
    )
}

let album_detail = (req, res, next) => {
    async.parallel(
        {
            album(cb) {
                Album.findById(req.params.id)
                .populate("genre")
                .populate("artist")
                .exec(cb)
            }
        },

        (err, results) => {
            if(err) return next(err)

            // console.log(results, "<<results>>")

            res.render("album-detail", {
                title: "Album Detail",
                album: results.album,
                cover: results.album.img_file?.toString('base64')
            })
        }
    )
}

let album_create_get = (req, res, next) => {
    async.parallel(
        {
            artists(cb) {
                Artist.find(cb)
            },

            genres(cb) {
                Genre.find(cb)
            }
        },

        (err, results) => {
            if(err) {
                return next(err);
            }

            // console.log(results, "results!!")

            res.render("form_album", {
                title: "Album Form", 
                album: null, 
                genres: results.genres, 
                artists: results.artists,
                errors: null,
                update_flag: null
            })
        }
    )
}

// let album_create_get = (req, res) => {
//     res.render("form_album_detail", {title: "Album Form", album: null, genres: []})
// }

let album_create_post = [
    // console.log(req.body, "here here!!")
    // Convert the genre to an array
    (req, res, next) => {
        if(!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === undefined ? [] : [req.body.genre]
        }
        next();
    },

    // validate and sanitize fields
    body("name", "Name field value must be present")
    .trim().isLength({min: 1}).escape(),
    body("artist", "Artist field value must be present")
    .trim().isLength({min: 1}).escape(),
    body("descr", "Decription field value must be present")
    .trim().isLength({min: 1}).escape(),
    body("price", "Price field value must be present")
    .trim().isLength({min: 1}).escape(),
    body("r_date", "Released Date field value must be present")
    .trim().isLength({min: 1}).escape(),
    body("genre.*").escape(), // using wildcard to sanitize every item below key genre

    // Process request after validation and sanitization
    (req, res, next) => {
        // console.log(req.file.buffer, req.file, "HERERERERE")
        // Extract the validation errors from a request
        let errors = validationResult(req)

        // create an album object from user submitted data
        let album = new Album({
            name: req.body.name,
            artist: req.body.artist,
            genre: req.body.genre,
            released_date: req.body.r_date,
            description: req.body.descr,
            price: req.body.price,
            img_file: req.file?.buffer
        })

        // Extract the validation errors from a request
        if(!errors.isEmpty()) {
            // There are errors
            // Render form again with sanitized values/error messages.
            // Get all artits and genres for form to render
            async.parallel(
                {
                    artists(cb) {
                        Artist.find(cb)
                    },

                    genres(cb) {
                        Genre.find(cb)
                    }
                },

                (err, results) => {
                    if(err) return next(err)

                    // trying out photo upload
                    // upload.single("avatar")

                    // Mark our selected genres as checked
                    for(let genre of results.genres) {
                        if(album.genre.includes(genre._id)) {
                            // Current genre is selected. Set "checked" flag
                            genre.checked = true
                        }
                    }

                    // Mark our selected artist as selected
                    for(let artist of results.artists) {
                        if(album.artist.toString() === artist._id.toString()) {
                            artist.selected = true;
                        }
                    }

                    // render form with previously form values
                    res.render("form_album", {
                        title: "Album Form", 
                        album: album,
                        genres: results.genres, 
                        artists: results.artists,
                        errors: errors.array(),
                        update_flag: false
                    })
                }
            )
            return
        }

        // Data from form is valid. Save book
        album.save( err => {
            if(err) return next(err)

            // Successful: redirect to new album record
            res.redirect(album.url)
        })
    }
]

let album_delete_get = (req, res, next) => {
    async.parallel(
        {
            album(cb) {
                Album.findById(req.params.id).exec(cb)
            },

            tracks(cb) {
                Track.find({album: req.params.id}).exec(cb)
            }
        },

        (err, results) => {
            if(err) return next(err);

            // console.log(results, "<<results>>");

            res.render("delete_album", {
                title: "Delete Album",
                tracks: results.tracks,
                album: results.album,
                errors: null
            })
        }
    )
}

// let album_delete_post = (req, res, next) => {
//     Album.findByIdAndDelete(req.body.albumid)
//     .then(() => console.log("Album Deleted...."))
//     .catch(err => next(err))
//     .finally(() => res.redirect("/catalog/albums"))
// }

let album_delete_post = [
    
    body("admin_code", "Admin Code can not be empty")
    .trim().isLength({min: 2}).escape(),
    body("admin_code", "Code does not match with secret")
    .trim().equals("1234").escape(),

    (req, res, next) => {
        let errors = validationResult(req);

        // extracting albumid from form
        let albumid = req.body.albumid;
        
        if(!errors.isEmpty()) {
            async.parallel(
                {
                    album(cb) {
                        Album.findById(albumid).exec(cb)
                    },
        
                    tracks(cb) {
                        Track.find({album: albumid}).exec(cb)
                    }
                },
        
                (err, results) => {
                    if(err) return next(err);
        
                    // console.log(results, "<<results>>");
        
                    res.render("delete_album", {
                        title: "Delete Album",
                        tracks: results.tracks,
                        album: results.album,
                        errors: errors.array()
                    })
                }
            )
            return
        }

        Album.findByIdAndDelete(albumid)
        .then(() => console.log("Album Deleted...."))
        .catch(err => next(err))
        .finally(() => res.redirect("/catalog/albums"))
    }
]

let album_update_get = (req, res, next) => {
    async.parallel(
        {
            album(cb) {
                Album.findById(req.params.id)
                .populate("genre")
                .populate("artist")
                .exec(cb)
            },

            artists(cb) {
                Artist.find(cb)
            },

            genres(cb) {
                Genre.find(cb)
            }
        },

        (err, results) => {
            if(err) return next(err);

            // console.log(results, "results!!");
            
            // marking already checked genres
            results.genres?.forEach(genre => {
                results.album.genre.forEach(item => {
                    if(item._id.toString() === genre._id.toString()) {
                        genre.checked = true;
                    }
                })
            })

            // marking already selected option
            results.artists?.forEach(artist => {
                if(results.album.artist._id.toString() === artist._id.toString()) {
                    artist.selected = true
                }
            })

            // console.log(results, "results!!");

            res.render("form_album", {
                title: "Album Form",
                album: results.album,
                genres: results.genres,
                artists: results.artists,
                errors: null,
                update_flag: true,
            })
        }
    )
}

let album_update_post = [
    // making sure genre is always into an array
    (req, res, next) => {
        if(!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === undefined ? [] : [req.body.genre]
        }
        next()
    },

    // sanitization and validation user submited data
    body("name", "Name field can not be left empty")
    .trim().isLength({min: 1}).escape(),
    body("artist", "Artist field can not be left empty")
    .trim().isLength({min: 1}).escape(),
    body("r_date", "Released Date field can not be left empty")
    .trim().isLength({min: 1}).escape(),
    body("price", "Price field can not be left empty")
    .trim().isLength({min: 1}).escape(),
    body("admin_code", "Admin Code can not be empty")
    .trim().isLength({min: 2}).escape(),
    body("admin_code", "Code does not match with secret")
    .trim().equals("1234").escape(),
    body("genre.*").escape(), // using a wildcard for genre so hat it matches everything in it

    // Process request after sanitization and validation
    (req, res, next) => {
        // extracting any errors there might be
        let errors = validationResult(req);

        // creating an album instacne to update if everything is alright or re render with these values
        let album = new Album({
            img_file: req.file?.buffer,
            name: req.body.name,
            artist: req.body.artist,
            genre: req.body.genre,
            released_date: req.body.r_date,
            description: req.body.descr,
            price: req.body.price,
            _id: req.params.id
        })

        if(!errors.isEmpty()) {
            // there are errors found, so we'll re render album form with user submitted value and errors list to correct them by user

            // now we will call artist and genres to render along with genre instance that we just created
            async.parallel(
                {
                    genres(cb) {
                        Genre.find(cb)
                    },
                    
                    artists(cb) {
                        Artist.find(cb)
                    }
                },

                (err, results) => {
                    if(err) return next(err);

                    results.genres?.forEach(genre => {
                        if(genre._id.toString() === album.genre.toString()) {
                            genre.checked = true;
                        }
                    })

                    results.artists?.forEach(artist => {
                        if(artist._id.toString() === album.artist.toString()) {
                            artist.selected = true;
                        }
                    })

                    res.render("form_album", {
                        title: "Album Form",
                        album: album,
                        genres: results.genres,
                        artists: results.artists,
                        errors: errors.array(),
                        update_flag: true
                    })
                }
            )

            return
        }

        // otherwise successfull, so lets update and redirect to its detail page view
        // checking admin code matches with secret code, for safety precaution
        // if not then we're 
        Album.findByIdAndUpdate(req.params.id, album, {},  (err) => {
            if(err) return next(err);

            res.redirect(album.url)
        })
    }
]

module.exports = {
    albums_list,
    album_detail,
    album_create_get,
    album_create_post,
    album_delete_get,
    album_delete_post,
    album_update_get,
    album_update_post
}