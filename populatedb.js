#! /usr/bin/env node

console.log('This script populates some test albums, artist, genres and tracks to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Album = require('./models/music_album')
var Artist = require('./models/music_artist')
var Genre = require('./models/music_genre')
var Track = require('./models/music_track')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var artists = []
var genres = []
var albums = []
var tracks = []

function artistCreate(first_name, last_name, d_birth, d_death, cb) {
  artistdetail = { first_name: first_name, last_name: last_name }
  if (d_birth != false) artistdetail.d_o_b = d_birth
  if (d_death != false) artistdetail.d_o_d = d_death

  var artist = new Artist(artistdetail);

  artist.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Artist: ' + artist);
    artists.push(artist)
    cb(null, artist)
  });
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  });
}

function albumCreate(title, summary, released_date, artist, genre, price, cb) {
  albumdetail = {
    name: title,
    description: summary,
    artist,
    released_date,
    price
  }
  if (genre != false) albumdetail.genre = genre

  var album = new Album(albumdetail);
  album.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Album: ' + album);
    albums.push(album)
    cb(null, album)
  });
}


function trackCreate(album, genre, status, name, cb) {
  trackdetail = {
    album,
    genre,
    name: name,
  }

  if (status != false) trackdetail.status = status

  // console.log(name, trackdetail, "<<trackdetail>>")

  var track = new Track(trackdetail);
  track.save(function (err) {
    if (err) {
      console.log('ERROR CREATING track: ' + track);
      cb(err, null)
      return
    }
    console.log('New Track: ' + track);
    tracks.push(track)
    cb(null, album)
    // cb(null, track)
  });
}


function createGenreAndArtists(cb) {
  async.series(
    [
      function (callback) {
        artistCreate('James', 'Guru', '1973-06-06', false, callback);
      },
      function (callback) {
        artistCreate('Michael', 'Jackson', '1932-11-8', false, callback);
      },
      function (callback) {
        artistCreate('Iron', 'Maiden', '1920-01-02', false, callback);
      },
      function (callback) {
        artistCreate('Art', 'Cell', '1920-01-02', false, callback);
      },
      function (callback) {
        artistCreate('Dream', 'Theater', '1971-12-16', false, callback);
      },
      function (callback) {
        genreCreate("R&B", callback);
      },
      function (callback) {
        genreCreate("Rock", callback);
      },
      function (callback) {
        genreCreate("Metal", callback);
      },
      function (callback) {
        genreCreate("EDM", callback);
      },
      function (callback) {
        genreCreate("Progressive", callback);
      },
      function (callback) {
        genreCreate("Trance", callback);
      },
      function (callback) {
        genreCreate("Pop", callback);
      },
    ],
    // optional callback
    cb);
}


function createAlbums(cb) {
  async.parallel([
    function (callback) {
      albumCreate("Apitaf", "Awesome songs", "2000/01/01", artists[0], genres[2], 22, callback)
    },
    function (callback) {
      // albumCreate("Lais Fita", "Many more awesome songs", "2002/01/01", artists[0], [genres[2],], 22, callback)
      albumCreate("Lais Fita", "Many more awesome songs", "2002/01/01", artists[0], genres[2], 22, callback)
    },
    function (callback) {
      albumCreate("Dangerous", "Globally renowned awesome songs", "2000/01/01", artists[1], [genres[2], ], 22, callback)
    },
    function (callback) {
      albumCreate("Dangerous- II", "Globally renowned awesome songs", "2002/01/01", artists[2], [genres[4], genres[2]], 22, callback)
    },
    function (callback) {
      albumCreate("Dangerous- III", "Globally renowned awesome songs", "2000/01/01", artists[3], [genres[5], genres[4]], 22, callback)
    },
    function (callback) {
      albumCreate("Dangerous-IV", "Globally renowned awesome songs", "2000/01/01", artists[4], genres[4], 22, callback)
    },
    function (callback) {
      albumCreate("Fear Of De Dark", "Globally renowned awesome songs", "2000/01/01", artists[1], [genres[6], genres[3]], 22, callback)
    }
  ],
    // optional callback
    cb);
}


function createTracks(cb) {
  async.parallel([
    function (callback) {
      trackCreate(albums[0], genres[0], "Play", "name test", callback)
      // trackCreate(albums[0], "genres[1]", "Play", name, callback)
    },
    function (callback) {
      trackCreate(albums[1], genres[1], "Play", "name test - II", callback)
    },
    function (callback) {
      trackCreate(albums[2], genres[2], "Play", "name test - III", callback)
    },
    function (callback) {
      trackCreate(albums[3], genres[3], "Play", "name test - IV", callback)
    },
    function (callback) {
      trackCreate(albums[3], genres[2], "Play", "name test - V", callback)
    },
    function (callback) {
      trackCreate(albums[2], genres[4], "Play", "name test - VI", callback)
    },
    function (callback) {
      trackCreate(albums[2], genres[1], "Play", "name test - VII", callback)
    },
    function (callback) {
      trackCreate(albums[4], genres[5], "Play", "name test - VIII", callback)
    },
    function (callback) {
      trackCreate(albums[5], genres[4], "Play", "name test - IX", callback)
    },
    function (callback) {
      trackCreate(albums[2], genres[2], "Play", "name test - X", callback)
    },
    function (callback) {
      trackCreate(albums[4], genres[3], "Play", "name test - XI", callback)
    }
  ],
    // Optional callback
    cb);
}



async.series([
  createGenreAndArtists,
  createAlbums,
  createTracks
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log('Tracks: ' + tracks);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });