//MongoDB
UsersList = new Mongo.Collection('siteUsers');
Chat = new Mongo.Collection('messages');

// This publishes user status from the mizzao:user-status package.
Meteor.publish('userStatus', function() {
    return Meteor.users.find({ "status.online": true }, { fields: { username: 1, status: 1 } });
});

Meteor.publish('grabMessages', function() {
    var currPage = Session.get('currentPage');
    return Chat.find({board: currPage}, {sort: {timeCreated: -1}});
});

Meteor.methods({
    getServerTime: function () {
        var _time = new Date();
        return _time;
    }
});