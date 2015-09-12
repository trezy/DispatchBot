var Backbone, User;





Backbone = require( 'backbone' );





User = Backbone.Model.extend({
  defaults: {
    nickname: '',
    operator: false,
    rat: false,
    currentRescue: null
  }
});





module.exports = User;
