const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Movies', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongodb connected')
});

const movieSchema = mongoose.Schema({
  movieId: {type: String, unique: true}
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = {
  create: ( data, func ) => {
    let movie = new Movie({
        movieId: data.movieId
    })
    movie.save((err, data) => {
      if(err) { return func(err, null) };
      return func(null, data.movieId)
    })
  },
  delete: ( data, func ) => {
    Movie.deleteOne({ 'movieId': data.movieId }, (err) => {
      if(err) { return func(err) };
      return func(null);
    })
  },
  read: ( func ) => {
    Movie.find((err, data) => {
      if(err) { return func(err, null) };
      return func(null, data)
    })
  }, 
}