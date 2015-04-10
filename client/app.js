//MongoDB
UsersList = new Mongo.Collection('siteUsers');
Chat = new Mongo.Collection('messages');
    
Router.route('/', function () {
  Session.set('currentPage', 'Shatter');
});

Router.route('layout', {
    path: '/:someValue',
    template: 'layout',
    waitOn: function () {
        return Meteor.subscribe('messages', this.params.someValue);
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
        //var currBoard = Session.get('currentPage');
        var currBoard = Router.current().params.someValue;
        var newMessage = event.target.message.value;
        if (currBoard != 'Shatter') {
            // insecure package is removed, so you must either use allow/deny rules,
            // or move your inserts to server methods.
            var req = {
                newMessage: newMessage,
                currBoard: currBoard,
            }
            Meteor.call('insertMessage', req);
        };
        event.target.message.value = "";
    }
});

Template.submitMessage.helpers({
    'placeholder': function(){
        //var currPage = Session.get('currentPage');
        var currPage = Router.current().params.someValue;
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

// Subscribe to the userStatus publication that was declared on the server.
Meteor.subscribe('userStatus');

Template.online.helpers({
    usersOnline: function(){
        // returns a reactive cursor to a collection of online users.
        return Meteor.users.find({ "status.online": true });
    }
});

Template.chat.helpers({
    'messageGrab': function(){
        //var currPage = Session.get('currentPage');
        var currPage = Router.current().params.someValue;
        return Chat.find({board: currPage}, {sort: {timeCreated: -1}});  
    },
    'formatDate': function(date) {
        return moment(date).format('MMMM Do');
    },
    'formatTime': function(date) {
        return moment(date).format('HH:mm:ss');
    },
    'showUsername': function(){
        return Meteor.user().username
    },
    'currentPageFisk': function(){
        return Session.get('currentPage');
    },
    getUsername: function (user_id) {
        return Meteor.users.find({_id: user_id}).username;
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