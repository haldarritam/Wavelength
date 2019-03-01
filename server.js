const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

//Connect to mongodb
mongo.connect('mongodb://127.0.0.1/wavelength', { useNewUrlParser: true }, function(err, database){
  if(err){
    throw err;
  }
  console.log('MongoDB connected...');
  //const DB = database.db('Wavelength')

  //Connect to socket.io
  client.on('connection', function(socket){
    let chat = database.db().collection('chats');

    //Function to send status
    sendStatus = function(s){
      socket.emit('status', s);
    }

    //Get chats from mongo collection
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
      if(err){
        throw err;
      }

      //Emit the messages
      socket.emit('output', res);
    });

    //Handle input events
    socket.on('input', function(data){
      let name = data.name;
      let message = data.message;

      //Check for name and messages
      if(name == "" || message == ''){
        sendStatus('Please enter a name and a message');
      }
      else {
        //Insert messages
        chat.insert({name: name, message: message}, function(){
          client.emit('output', [data]);

          //Send status object
          sendStatus({
            message: 'Message sent',
            clear: true
          });
        });
      }
    });

    //Handle clear
    socket.on('clear', function(data){
      //Remove all chats from collection
      chat.remove({}, function(){
        //Emit cleared
        socket.emit('cleared');
      });
    });
  });
});
