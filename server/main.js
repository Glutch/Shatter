//MongoDB
UsersList = new Mongo.Collection('siteUsers');
Chat = new Mongo.Collection('messages');

// This publishes user status from the mizzao:user-status package.
Meteor.publish('userStatus', function() {
    return Meteor.users.find({ "status.online": true }, { fields: { username: 1, status: 1 } });
});

Meteor.publish('messages', function(current_page) {
    return Chat.find({board: current_page}, {sort: {timeCreated: -1}});
});

Meteor.methods({
    getServerTime: function () {
        var _time = new Date();
        return _time;
    },
    insertMessage: function (req) {
    	// get the message request params
    	newMessage = req.newMessage;
    	currBoard = req.currBoard;
    	currUsername = Meteor.users.findOne({_id: this.userId}).username;
    	Chat.insert({
			message: newMessage,
			createdBy: currUsername,
			timeCreated: new Date(),
			board: currBoard
		});
	}
});