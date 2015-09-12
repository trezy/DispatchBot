var Backbone, Rescue;





Backbone = require( 'backbone' );





Rescue = Backbone.Model.extend({
  defaults: {
    clientCMDRname: null,
    clientNickname: null,
    nearestSystem: null,
    platform: null,
    rats: [],
    stage: 1,
    system: null
  }
});





module.exports = Rescue;
