const { DateTime } = require("luxon");
let luxon = require("luxon")

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let MusicAlbumSchema = new Schema(
    {
        img_file: {type: Schema.Types.Buffer},
        name: {type: Schema.Types.String, required: true},
        released_date: {type: Schema.Types.Date, required: true},
        genre: [{type: Schema.Types.ObjectId, ref: "MusicGenre"}],
        // genre: {type: Schema.Types.ObjectId, ref: "MusicGenre"},
        // genre: {type: Schema.Types.String, ref: "MusicGenre"},
        artist: {type: Schema.Types.ObjectId, ref: "MusicArtist"},
        description: {type: Schema.Types.String, required: true},
        price: {type: Schema.Types.Number, required: true}
    }
)

MusicAlbumSchema.virtual("artistName")
.get(function() {
    let fullName = "";
    fullName += this.artist.first_name + " " + this.artist.last_name
    // console.log(fullName, "<<fullname>>")
    return fullName;
})

MusicAlbumSchema.virtual("album_artist_url")
.get(function() {
    return "/catalog/artist/"+this.artist._id
})

MusicAlbumSchema.virtual("album_genre")
.get(function() {
    let genreStr = '';
    this.genre?.forEach(item => genreStr += item.name + " ")
    return genreStr;
})

MusicAlbumSchema.virtual("album_genre_v2")
.get(function() {
    return this.genre;
})

MusicAlbumSchema.virtual("released_date_format")
.get(function() {
    return `${DateTime.fromJSDate(this.released_date).toLocaleString(DateTime.DATE_MED)}`
})

MusicAlbumSchema.virtual("form_date")
.get(function() {
    return DateTime.fromJSDate(this.released_date).toISODate()
})

MusicAlbumSchema.virtual("url")
.get(function() {
    return "/catalog/album/"+this._id
})

module.exports = mongoose.model("MusicAlbum", MusicAlbumSchema)