let async = require("async");
let Album = require("../models/music_album");
let Artist = require("../models/music_artist");
let Genre = require("../models/music_genre");
let Track = require("../models/music_track");

// let a_g_counts = {}

// catalog homepage
// let index = function (req, res) {
//     res.send('NOT IMPLEMENTED: Site Home Page');
// };

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * 
 * creating a catalog view for site, which will be a landing page for this webiste
 * we will be looking at every available table and get required values form it to show it on view
 * we'll get how many artists, albums, tracks are there
 * we'll also get how many different kinds of "genre" albums are there
 * 
 */
let index = function (req, res, next) {
    async.parallel(
        {
            count_albums(cb) {
                // Pass an empty object as a match condition to find all documents of this collection
                Album.countDocuments({}, cb);
            },

            count_artists(cb) {
                // Passing an empty object as a match condition to find all documents of this collection
                Artist.countDocuments({}, cb);
            },

            count_genres(cb) {
                // Passing an empty object as a match condition to find all documents of this collection
                Genre.countDocuments({}, cb);
            },

            count_tracks(cb) {
                // Passing an empty object as a match condition to find all documents of this collection
                Track.countDocuments({}, cb);
            },

            async albums_genres(cb) {
                const genresPromise = Album.find({})
                    .then((albums) => {
                        const promises = albums?.flatMap((album) => album?.genre.map((id) => Genre.findById(id)));
                        return Promise.all(promises);
                    });

                const a_g_countsPromise = genresPromise.then((genres) => {
                    const a_g_counts = genres.reduce((a_g_counts, item) => {
                        a_g_counts[item.name] = a_g_counts[item.name] != null ? a_g_counts[item.name] + 1 : 1;
                        return a_g_counts;
                    }, {});
                    console.log(a_g_counts);
                    return a_g_counts;
                }).catch(err => next(err))

                return a_g_countsPromise
                    .then(res => {
                        // console.log(res, "<<RESRES>>");
                        return res
                    }).catch(err => next(err))

                // return a_g_countsPromise.then(() => cb)
            }
        },

        // resulting callback
        (err, results) => {
            if (err) return next(err);

            // console.log(results, "<<results>>")

            res.render("catalog", {
                title: "Website Catalog",
                results: results
            })
        }
    )

    // res.render("catalog", {
    //     title: "Website Catalog"
    // })
};

module.exports = { index: index }

/**
 * 
 * 
 // resulting callback
        (err, results) => {
            if (err) return next(errr);

            console.log(results, "<<results>>")

            let a_g_counts = {}

            Album.find({})
                .then(albums => {
                    albums?.forEach(album => {
                        album?.genre.forEach(id => {
                            Genre.findById(id)
                                .then(item => {
                                    a_g_counts[item.name] = a_g_counts[item.name] != null ? a_g_counts[item.name] + 1 : 1
                                    // console.log(a_g_counts, "a_g_counts") // it shows up here just fine....
                                })
                            // console.log(a_g_counts, "a_g_counts") // doesn't show up!!
                        })
                    })
                    console.log(a_g_counts, "a_g_counts") // doesn't show up here either!! why though?!
                })

            res.render("catalog", {
                title: "Website Catalog",
                test: a_g_counts
            })
        }
 * 
 * 
 // albums2() {
            //     let a_g_counts = {}
            //     Album.find({})
            //     .then(albums => {
            //         albums?.forEach(album => {
            //             album?.genre.forEach(id => {
            //                 Genre.findById(id)
            //                 .then(item => {
            //                     a_g_counts[item.name] = a_g_counts[item.name] != null ? a_g_counts[item.name] + 1 : 1
            //                 })
            //             })
            //         })
            //         console.log(a_g_counts, "a_g_counts")
            //     })
            // },
 * 
 * 
 albums(cb) {
                // Album.find({}, cb)
                Album.find({})
                    .exec((err, list) => {
                        if (err) return next(err);
                        let a_g_counts = {}
                        // console.log(list, "list")
                        list?.forEach(gl => {
                            // console.log(gl.genre, "g_id")
                            gl.genre?.forEach(g_id => {
                                Genre.findById(g_id)
                                    .exec((err, g_fnd) => {
                                        if (err) return next(err)
                                        // console.log(g_fnd, 'g_fnd')
                                        // console.log(a_g_counts, "<<a_g_counts>>")
                                        a_g_counts[g_fnd.name] = a_g_counts[g_fnd.name] != null ? a_g_counts[g_fnd.name] + 1 : 1
                                    })
                            })
                            // return a_g_counts
                        })

                        // console.log(a_g_counts, "<<a_g_counts>>")
                        return a_g_counts
                    })
            }
 */