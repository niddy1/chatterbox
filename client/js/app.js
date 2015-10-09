console.log('we good');
angular.module('ChatApp', []);

angular.module('ChatApp')
  .controller('ChatsController', ['$scope','$http', function($scope, $http){
    $scope.welcomeMessage = 'chatterBox'

    //on the scope, place the socket cdn allows us to use the io function, this is the
    $scope.socket = io();

    //client socket and serverside socket are the same/connected
    //the variable is sitting in both places

    $scope.chats = [];

    $http.get('/api/chats').then(function(response){
      $scope.chats = response.data;
    });

    $scope.newChat = {};
    $scope.sendChat = function(){
      //go to the socket, tell it there is a ('new message', theMessage)
      $scope.socket.emit('sending message', $scope.newChat);
    };
    //when someone says they are emitting message
    $scope.socket.on('emitting message', function(message){
      $scope.newChat.message = null
      $scope.chats.push(message)
      //look to see if anything needs to be rendered, render it all
      $scope.$digest();
    });


  }]);
