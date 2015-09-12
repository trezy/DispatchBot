var Backbone, Rescues, Rescue;





Backbone = require( 'backbone' );
Rescue = require( '../models/Rescue' );





Rescues = Backbone.Collection.extend({
  model: Rescue
});





module.exports = Rescues;
