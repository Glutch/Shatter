//MongoDB
UsersList = new Mongo.Collection('siteUsers');
Chat = new Mongo.Collection('messages');

if (Meteor.isClient) {
    
    Router.route('/', function () {
      Session.set('currentPage', 'Shatter');
    });
    
    Router.route('/:someValue', {
        onBeforeAction: function () {
            Session.set('currentPage', this.params.someValue);
        }
    });
  
    Session.set('currentPage', 'Shatter');
    
    Template.navigate.events({
        'click .homeBtn': function () {
            Session.set('currentPage', 'Home');
            document.title = 'Home';
            Router.go('/Home');
        },
        'submit form': function(event){
            event.preventDefault();
            var board = event.target.gotoBoard.value;
            Session.set('currentPage', board);
            event.target.gotoBoard.value = "";
            document.title = board;
            Router.go('/'+board);
            
            
            UsersList.insert({
                user: Meteor.user().username,
                board: Session.get('currentPage'),
                timeJoined: Session.get('time')
            })
            
        }
    });
    
    Template.navigate.helpers({
        'currentPage': function() {
            return Session.get('currentPage');
        }
    });
    
    Template.submitMessage.events({
        'submit form': function(event){
            event.preventDefault();
            var currBoard = Session.get('currentPage');
            var newMessage = event.target.message.value;
            var currentUserId = Meteor.user().username;
            if (currBoard != 'Shatter'){
                Chat.insert({
                    message: newMessage,
                    createdBy: currentUserId,
                    timeCreated: Session.get('time'),
                    board: currBoard
                })
            };
            event.target.message.value = "";
        }
    });
    
    Template.submitMessage.helpers({
        'placeholder': function(){
            var currPage = Session.get('currentPage');
            if (currPage == 'Shatter'){
                return "You can't type in /Shatter, please visit another board.";
            } else {
                return "Write a message...";
            };
        }
    });
    
    Template.chat.events({
        'mouseover .creator': function(){
            $('.messageTime').addClass('messageTimeShown');
            $('.createdBy').hide();
        },
        'mouseleave .creator': function(){
            $('.messageTime').removeClass('messageTimeShown');
            $('.createdBy').show();
        }
    });
    
    Template.chat.helpers({
        'messageGrab': function(){
            var currPage = Session.get('currentPage');
            var currentUserId = Meteor.userId();
            //return PlayersList.find({}, {sort: {score: -1, name: 1} })
            return Chat.find({board: currPage}, {sort: {timeCreated: -1}});
            
        },
        'formatDate': function(date) {
            return moment(date).format('MMMM Do');
        },
        'formatTime': function(date) {
            return moment(date).format('HH:mm:ss');
        },
        'userGrab': function(){
            var currPage = Session.get('currentPage');
            return UsersList.find({board: currPage}, {sort: {timeJoined: -1}});
        },
        'showUsername': function(){
            return Meteor.user().username
        },
        'currentPageFisk': function(){
            return Session.get('currentPage');
        }
    });
    
    Template.online.helpers({
        'isOnline': function(){
            if(Meteor.user().username){
                //alert('signed in');
            } else {
                alert('not signed in');
            }
            if(!Meteor.user()){
                alert('not signed in');
            }
        }   
    });
    
    Template.foo.helpers({
        'usersOnline': function(){
            return Meteor.users.find({ "status.online": true });
        }
    });
    
    //hello
    Accounts.onLogin(function () {
        console.log('hello');
    });
    
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
    
    Meteor.startup(function () {
        setInterval(function () {
            Meteor.call("getServerTime", function (error, result) {
                Session.set("time", result);
            });
        }, 1000);
    });
    
    Tracker.autorun(function () {
    if (Meteor.userId()) {
        alert('signed in');
    } else {
        alert('signed out');
    }
});
    
}

if (Meteor.isServer) {
  Meteor.startup(function () {
      
      
    
    Meteor.methods({
        getServerTime: function () {
            var _time = new Date();
            return _time;
        }
    });
      
  });
}