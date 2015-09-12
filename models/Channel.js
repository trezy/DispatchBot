var Backbone, Channel, MessagesCollection, UsersCollection;





Backbone = require( 'backbone' );
MessagesCollection = require( '../collections/Messages' );
UsersCollection = require( '../collections/Users' );





Channel = Backbone.Model.extend({
  defaults: {
    users: new UsersCollection,
    messages: new MessagesCollection
  }
});





module.exports = Channel;
