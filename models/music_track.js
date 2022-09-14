let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let MusicTrackSchema = new Schema (
    {
        name: {type: Schema.Types.String, required: true},
        // name: {type: Schema.Types.String},
        genre: [{type: Schema.Types.ObjectId, ref: "MusicGenre", required: true}],
        album: {type: Schema.Types.ObjectId, ref: "MusicAlbum", required: true},
        status: {type: Schema.Types.String, required: true, enum: ["Free", "Preview", "Play", "Download"]},
    }
)

MusicTrackSchema.virtual("album_name")
.get(function() {
    // console.log(this.album.name, "?>>?>", this.album, this.genre)
    return this.album.name
})

MusicTrackSchema.virtual("url")
.get(function() {
    return "/catalog/track/"+this._id
})

MusicTrackSchema.virtual("album_url")
.get(function() {
    return "/catalog/album/"+this.album._id
})

// MusicTrackSchema.virtual("genre_list")
// .get(function() {

// })

MusicTrackSchema.virtual("track_genre")
.get(function() {
    let str = ''
    this.genre?.forEach((item, idx) => {
        if(idx === this.genre.length - 1) {
            str += item.name
        } else {
            str += item.name + ", "
        }
    })
    return str
})

module.exports = mongoose.model("MusicTrack", MusicTrackSchema);