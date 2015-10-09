var express  = require('express'),
    mongoose = require('mongoose'),
    http     = require('http'),
    socketIo = require('socket.io');
//make me an express server
var app = express();
//need another server to handle socketIO, a server within
var wrapperServer = http.Server(app);
// socketIO needs to have it's own abilities to establish sockets. thats why you need a new http server
//need some socket abilities, pass into the server, those abilities
var io = socketIo(wrapperServer);

//setting up DB
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/chatserver');
var ChatSchema = new mongoose.Schema({
  username: {type: String},
  message: {type: String}
});

var Chat = mongoose.model('Chat', ChatSchema);



app.use(express.static(__dirname + '/client'));

//when IO determines a connection occured, run this function, and take socket(connection) with it
io.on('connection', function(socket){
  console.log('...user connected');
  //when someone says ('new message', take message and emit('sending message', message))
  socket.on('sending message', function(message){
    console.log('received message:', message);
    var chat = new Chat(message);
    chat.save(function(){
      //upon completion of saving it, send down the message
      io.emit('emitting message', message)
    });
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

//when there has been an api request to chats, go get em, send em down
app.get('/api/chats', function(req, res){
  Chat.find({}, function(err, chats){
    res.json(chats);
  });
});

//in the environment, is there something called a port, use it, if not use 8080
var port = process.env.PORT || '8080'
wrapperServer.listen(port, function(){
  console.log("listenin");
});
