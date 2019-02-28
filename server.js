const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

//Connect to mongodb
mongo.connect('mongodb://127.0.0.1/Wavelength', { useNewUrlParser: true }, function(err, db){
  if(err){
    throw err;
  }

  console.log('MongoDB connected...');
});
