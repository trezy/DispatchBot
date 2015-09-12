var Backbone, Bot, bot, EventEmitter, irc, channels, ChannelsCollection, RescuesCollection, UsersCollection;





Backbone = require( 'backbone' );
EventEmitter = require( 'events' ).EventEmitter;
irc = require( 'irc' );
ChannelsCollection = require( './collections/Channels' );
RescuesCollection = require( './collections/Rescues' );





config = {
  ircServer: 'irc.ca.us.mibbit.net',
  botName: 'DispatchBot[Trezy-is-testing]',

  channels: {
    chat: '#trezy', // '#RatChat'
    help: '#trezy2', // '#FuelRats'
    drill: '#trezy3' // '#RatChat'
  },

  messages: {
    welcome: '#{nickname}, welcome to #FuelRats! If you need fuel, make sure to use the signal!',
    ratsignal: 'Signal recieved, #{nickname}. A Fuel Rat will be with you shortly.',
    emergency: 'If you are currently operating on emergancy oxygen, please log out IMMEDIATELY, let the channel know, and wait for further instructions.'
  }
};





Bot = function () {
  this.channels = new ChannelsCollection;
  this.rescues = new RescuesCollection;

  this.ircServer = this.joinServer( config.ircServer, config.botName );
}





Bot.prototype.bindServerEvents = function bindServerEvents ( ircServer ) {
  var self;

  self = this;

  ircServer.on( 'error', function () {
    self.onError.apply( self, arguments )
  });

  ircServer.on( 'join', function () {
    self.onJoin.apply( self, arguments )
  });

  ircServer.on( 'message', function () {
    self.onMessage.apply( self, arguments )
  });

  ircServer.on( 'names', function () {
    self.onNames.apply( self, arguments )
  });

  ircServer.on( 'registered ', function () {
    self.onRegistered.apply( self, arguments )
  });
}





Bot.prototype.joinServer = function joinServer ( ircServer, botName ) {
  var channelArray, channelKeys, newServer;

  channelArray = [];
  channelKeys = Object.keys( config.channels );

  for ( var i = 0; i < channelKeys.length; i++ ) {
    var channelName, key;

    key = channelKeys[i];
    channelName = config.channels[key];

    channelArray.push( channelName );

    this.channels.add({
      name: channelName,
      type: key
    });
  }

  newServer = new irc.Client( ircServer, botName, {
    channels: channelArray,
    userName: botName,
    realName: botName,
    stripColors: true
  });

  this.bindServerEvents( newServer );

  return newServer;
}





Bot.prototype.onError = function onError () {
  console.log( arguments );
}





Bot.prototype.onJoin = function onJoin ( channel, nickname ) {
  var message;

  if ( nickname === config.botName ) {
    return;
  }

  message = this.renderTemplate( config.messages.welcome, { nickname: nickname } );

  this.ircServer.say( channel, message );
}





Bot.prototype.onMessage = function onMessage ( nickname, channelName, message ) {
  var channel, data, messageArray, triggers;

  channel = this.channels.findWhere( { name: channelName } );

  channel.get('messages').add({
    user: nickname,
    message: message
  });

  if ( message.match( /ratsignal/gi ) ) {
    data = {
      channelName: channelName,
      clientNickname: nickname
    };

    messageArray = message.split( ',' );

    if ( messageArray[1] ) {
      data.clientCMDRname = messageArray[1];
    }

    if ( messageArray[2] ) {
      data.nearestSystem = messageArray[2];
    }

    if ( messageArray[3] ) {
      data.platform = messageArray[3];
    }

    this.startRescue( data );
  }
}





Bot.prototype.onNames = function onNames ( channelName, users ) {
  var channel, nicknames;

  channel = this.channels.findWhere( { name: channelName } );
  nicknames = Object.keys( users );

  for ( var i = 0; i < nicknames.length; i++ ) {
    var nickname;

    nickname = nicknames[i];

    operator = users[nickname] === '@';

    channel.get('users').add({
      nickname: nickname,
      operator: operator
    });
  }
}





Bot.prototype.onRegistered = function onRegistered () {}





Bot.prototype.renderTemplate = function renderTemplate ( template, data ) {
  var renderedTemplate;

  renderedTemplate = template.replace( /#{(.*)}/g, function ( match, key ) {
    return data[key];
  });

  return renderedTemplate;
}





Bot.prototype.startRescue = function startRescue ( channel, nickname ) {
  var message;

  message = this.renderTemplate( config.messages.ratsignal, { nickname: nickname } );

  //this.ircServer.say( channel, message );
  //this.ircServer.say( channel, irc.colors.wrap( 'light_red', config.messages.emergency ) );

  this.rescues.add({
    client: nickname
  });
}





bot = new Bot;
