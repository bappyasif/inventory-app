let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let MusicGenreSchema = new Schema(
    {
        cover_img: {type: Schema.Types.Buffer},
        name: {type: Schema.Types.String, minLength: 3, maxLength: 99}
    }
)

MusicGenreSchema.virtual("cover_photo")
.get(function() {
    return "data:image/jpeg;base64,"+this.cover_img.toString("base64")
})

MusicGenreSchema.virtual("url")
.get(function() {
    return "/catalog/genre/"+this._id;
})

module.exports = mongoose.model("MusicGenre", MusicGenreSchema)