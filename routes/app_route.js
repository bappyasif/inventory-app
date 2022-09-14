let multer = require("multer");
let storage = multer.memoryStorage();
let upload = multer({storage: storage})

// let upload = multer({dest: "uploads/"})

let express = require("express");

let router = express.Router();

// controller modules
let artistController = require("../controllers/artist_controller");
let albumController = require("../controllers/album_controller");
let genreController = require("../controllers/genre_controller");
let trackController = require("../controllers/track_controller");
let catalogController = require("../controllers/catalog_controller")

// Get catalog home page
router.get("/", catalogController.index)

// Album Routes

// GET request for creating an album
router.get("/album/create", albumController.album_create_get)

// POST request for creating an album
router.post("/album/create", upload.single("avatar"), albumController.album_create_post)

// GET request for deleting an album
router.get("/album/:id/delete", albumController.album_delete_get)

// POST request for deleting an album
router.post("/album/:id/delete", albumController.album_delete_post)

// GET request for updating an album
router.get("/album/:id/update", albumController.album_update_get)

// POST request for updating an album
router.post("/album/:id/update", upload.single("avatar"), albumController.album_update_post)

// GET request for one album
router.get("/album/:id", albumController.album_detail)

// GET request for list of all albums
router.get("/albums", albumController.albums_list)

// Artist Routes

// GET request for creating an artist
router.get("/artist/create", artistController.artist_create_get)

// POST request for creating an artist
router.post("/artist/create", upload.single('cover_photo'), artistController.artist_create_post)

// GET request for deleting an artist
router.get("/artist/:id/delete", artistController.artist_delete_get)

// POST request for deleting an artist
router.post("/artist/:id/delete", artistController.artist_delete_post)

// GET request for updating an artist
router.get("/artist/:id/update", artistController.artist_update_get)

// POST request for updating an artist
router.post("/artist/:id/update", upload.single('cover_photo'), artistController.artist_update_post)

// GET request for one artist
router.get("/artist/:id", artistController.artist_detail)

// GET request for list of all albums
router.get("/artists", artistController.artists_list)

// Genre Routes

// GET request for creating a genre
router.get("/genre/create", genreController.genre_create_get)

// POST request for creating a genre
router.post("/genre/create", upload.single("cover"), genreController.genre_create_post)

// GET request for deleting a genre
router.get("/genre/:id/delete", genreController.genre_delete_get)

// POST request for deleting a genre
router.post("/genre/:id/delete", genreController.genre_delete_post)

// GET request for updating a genre
router.get("/genre/:id/update", genreController.genre_update_get)

// POST request for updating a genre
router.post("/genre/:id/update", upload.single("cover"), genreController.genre_update_post)

// GET request for one genre
router.get("/genre/:id", genreController.genre_detail)

// GET request for list of all genres
router.get("/genres", genreController.genres_list)

// Track Routes

// GET request for creating a track
router.get("/track/create", trackController.track_create_get)

// POST request for creating a track
router.post("/track/create", trackController.track_create_post)

// GET request for deleting a track
router.get("/track/:id/delete", trackController.track_delete_get)

// POST request for deleting a track
router.post("/track/:id/delete", trackController.track_delete_post)

// GET request for updating a track
router.get("/track/:id/update", trackController.track_update_get)

// POST request for updating a track
router.post("/track/:id/update", trackController.track_update_post)

// GET request for one track
router.get("/track/:id", trackController.track_detail)

// GET request for list of all tracks
router.get("/tracks", trackController.tracks_list)

module.exports = router;