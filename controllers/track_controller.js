let Track = require("../models/music_track");

let Genre = require("../models/music_genre");

let Album = require("../models/music_album");

let async =  require("async");

let {body, validationResult} = require("express-validator");

let tracks_list = (req, res, next) => {
    async.parallel(
        {
            tracks(cb) {
                Track.find({})
                // when you have reference in model and yu need to acces them we'll have to use populate to generates those info as well
                .populate("album")
                .exec(cb)
            }
        },

        (err, results) => {
            if(err) return next(err);
            // console.log(results, "<<results>>");
            res.render("all-tracks", {
                title: "List Of All Tracks",
                tracks: results.tracks
            })
        }
    )
}

// let tracks_list = (req, res, next) => {
//     Track.find()
//     .then(results => {
//         console.log(results, "<<results>>");
//         res.render("all-tracks", {
//             title: "List Of All Tracks",
//             tracks: results
//         })
//     }).catch(err => next(err))
// }

let track_detail = (req, res, next) => {
    async.parallel(
        {
            track(cb) {
                Track.findById(req.params.id)
                .populate("genre")
                .populate("album").exec(cb)
            },

            // genres(cb) {
            //     Genre.find(cb)
            // },

            // albums(cb) {
            //     Album.find(cb)
            // }
        },

        (err, results) => {
            if(err) return next(err);

            // console.log(results, "<<results>>", results.genre)

            res.render("track_detail", {
                title: "Track Detail",
                track: results.track,
                // genres: results.genres,
                // albums: results.albums
            })
        }
    )
}

let track_create_get = (req, res, next) => {
    async.parallel(
        {
            genres(cb) {
                Genre.find(cb)
            },

            albums(cb) {
                Album.find(cb)
            }
        },

        (err, results) => {
            if(err) return next(err);

            // console.log(results, "<RESUTLS>")

            res.render("form_track", {
                title: "Create Track",
                albums: results.albums,
                genres: results.genres,
                errors: null,
                track: null,
                update_flag: false
            })
        }
    )
}

let track_create_post = [
    // making sure genre is an array no matter what, so that it doesnt violate schema
    (req, res, next) => {
        if(!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === undefined ? [] : [req.body.genre]
        }

        next()
    },

    // sanitizing and validating data
    body("name", "Track Name must not be empty")
    .trim().isLength({min: 1}).escape(),
    body("album", "Album Name must not be empty")
    .trim().isLength({min: 1}).escape(),
    body("status", "Track Status must not be empty")
    .trim().isLength({min: 1}).escape(),
    body("genre.*").escape(),


    (req, res, next) => {
        let errors = validationResult(req);

        let track = new Track({
            name: req.body.name,
            album: req.body.album,
            genre: req.body.genre,
            status: req.body.status
        })

        if(!errors.isEmpty()) {
            // has found error, now we'll rerender form with already filled fields and log errors on page
            async.parallel(
                {
                    genres(cb) {
                        Genre.find(cb)
                    },
                    
                    albums(cb) {
                        Album.find(cb)
                    }
                },
    
                (err, results) => {
                    if(err) return next(err);
    
                    // Mark our selected genres as checked
                    // console.log(results.genres, "!!results.genres!!")
                    // for(let genre of results.genres) {
                    //     if(track.genre.includes(genre._id)) {
                    //         // Current genre is selected. Set "checked" flag
                    //         genre.checked = true
                    //     }
                    // }  
                    results.genres.forEach(genre => {
                        if(track.genre?.includes(genre._id)) {
                            genre.checked = true
                        }
                    })

                    results.albums.forEach(album => {
                        // console.log(track.album, track.album.toString() === album._id.toString(), album._id)
                        if(track.album.toString() === album._id.toString()) {
                            album.selected = true
                        }
                    })

                    // render form with previously form values
                    res.render("form_track", {
                        title: "Create Track",
                        track: track,
                        albums: results.albums,
                        genres: results.genres,
                        errors: errors.array(),
                        update_flag: false
                    })
                }
            )

            return
        }

        track.save(err => {
            if(err) return next(err);

            // succesfull so lets render track detail view
            res.redirect(track.url)
        })
    }
]

let track_delete_get = (req, res, next) => {
    async.parallel(
        {
            track(cb) {
                Track.findById(req.params.id).exec(cb)
            }
        },

        (err, results) => {
            if(err) return next(err);

            res.render("delete_track", {
                title: "Delete Track",
                track: results.track,
                errors: null
            })
        }
    )
}

let track_delete_post = [
    body("admin_code", "Admin Code can not be empty")
    .trim().isLength({min: 2}).escape(),
    body("admin_code", "Code does not match with secret")
    .trim().equals("1234").escape(),

    (req, res, next) => {
        let errors = validationResult(req);

        let trackid = req.body.trackid;

        if(!errors.isEmpty()) {
            async.parallel(
                {
                    track(cb) {
                        Track.findById(trackid).exec(cb)
                    }
                },
        
                (err, results) => {
                    if(err) return next(err);
        
                    res.render("delete_track", {
                        title: "Delete Track",
                        track: results.track,
                        errors: errors.array()
                    })
                }
            )
            return
        }

        Track.findByIdAndDelete(trackid)
        .then(() => console.log("Track Deleted"))
        .catch(err => next(err))
        .finally(() => res.redirect("/catalog/tracks"))
    }
]

let track_update_get = (req, res, next) => {
    async.parallel(
        {
            albums(cb) {
                Album.find(cb)
            },

            genres(cb) {
                Genre.find(cb)
            },
            
            track(cb) {
                Track.findById(req.params.id).exec(cb)
            }
        },

        (err, results) => {
            if(err) return next(err);

            results.genres?.forEach(genre => {
                results.track.genre?.forEach(id => {
                    if(genre._id.toString() === id.toString()) {
                        genre.checked = true
                    }
                })
            })

            results.albums?.forEach(album => {
                if(album._id.toString() === results.track.album.toString()) {
                    album.selected = true;
                }
            })

            // console.log(results, "<><><><>")

            res.render("form_track", {
                title: "Update Track",
                albums: results.albums,
                genres: results.genres,
                errors: null,
                track: results.track,
                update_flag: true
            })
        }
    )
}

let track_update_post = [
    // making genre an array for compatapability
    (req, res, next) => {
        if(!Array.isArray(req.body.genre)) {
            req.body.genre = typeof req.body.genre === undefined ? [] : [req.body.genre]
        }

        next()
    },

    // sanitization and validation of user submited data
    body("name", "Name field must not be empty")
    .trim().isLength({min: 1}).escape(),
    body("album", "Album field must not be empty")
    .trim().isLength({min: 1}).escape(),
    body("admin_code", "Admin Code can not be empty")
    .trim().isLength({min: 1}).escape(),
    body("admin_code", "Code does not match with secret")
    .trim().equals("1234").escape(),
    body("genre.*").escape(),

    // begin process of updating
    (req, res, next) => {
        // extracting any potential errors
        let errors = validationResult(req);

        let track = new Track({
            name: req.body.name,
            genre: req.body.genre,
            album: req.body.album,
            status: req.body.status,
            _id: req.params.id
        })

        if(!errors.isEmpty()) {
            // there are errors, so we'll re render update form with user inputs
            async.parallel(
                {
                    genres(cb) {
                        Genre.find(cb)
                    },

                    albums(cb) {
                        Album.find(cb)
                    }
                },

                (err, results) => {
                    if(err) return next(err);

                    // console.log(results.genre, "<<results>>")
                    results.genres?.forEach(genre => {
                        // console.log(genre._id.toString() === track.genre, "<<results>>", genre._id.toString(), track.genre[0], track)
                        if(genre._id.toString() === track.genre[0].toString()) {
                            genre.checked = true
                        }
                    })

                    results.albums?.forEach(album => {
                        if(album._id.toString() === track.album.toString()) {
                            album.selected = true
                        }
                    })

                    res.render("form_track", {
                        title: "Update Track",
                        albums: results.albums,
                        genres: results.genres,
                        errors: errors.array(),
                        track: track,
                        update_flag: true
                    })
                }
            )

            return
        }

        // otherwise successfull, so we'll find and update this record on database and then redirect to it detail page
        Track.findByIdAndUpdate(req.params.id, track, {}, err => {
            if(err) return next(err);

            res.redirect(track.url)
        })        
    }
]

module.exports = {
    tracks_list,
    track_detail,
    track_create_get,
    track_create_post,
    track_delete_get,
    track_delete_post,
    track_update_get,
    track_update_post
}