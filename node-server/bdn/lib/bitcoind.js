var request = require('request');
var url     = require('url');

function Bitcoind(href, opts) {
  this.opts = opts || {};
  console.log(href);
  this.url = url.parse(href);
  console.log(this.url);
  if(!url.port)
    url.port = 8332;
};

Bitcoind.prototype.rpc = function(method, params, callback) {
  this.request({jsonrpc: '2.0', method: method, params: params}, callback);
};

Bitcoind.prototype.batch = function(cmds, callback) {
  var payload = [];
  for(var i=0;i<cmds.length;i++)
    payload.push({jsonrpc: '2.0', method: cmds[i].method, params: cmds[i].params, id: i});
  this.request(payload, callback);
};

Bitcoind.prototype.request = function(payload, callback) {
  console.log('get request payload:');
  console.log(payload);
  console.log('Send payload to:');
  console.log(this.url.href);

  request({uri: this.url.href, method: 'POST', json: payload}, function (error, response, body) {
    console.log('The request has been executed');
    if (!error && response.statusCode == 200) {
      if(body.result)
        callback(undefined, body.result);
      else
        callback(undefined, body);   
      return;
    }

    if(error) {
      if(error.message == 'connect ECONNREFUSED') {
        console.log('bitcoind error: connection refused');
        callback({message: "Could not connect to the bitcoin server"});
        return;
      }

      console.log('bitcoind error: unrecognized: '+JSON.stringify(error));
      callback({message: 'Received an unrecognized error from the bitcoin server'});
      return;
    }

    if(response.statusCode == 401) {
      console.log('bitcoind error 401: invalid auth (check your user/pass)');
      callback({message: "Invalid auth"});
    } else {
      if(body)
        console.log('bitcoind error '+response.statusCode+': '+JSON.stringify(body.error));
      else
        console.log('bitcoind error unknown');
      callback({message: 'Received an unrecognized error from the bitcoin server'});
    }
  });
};

module.exports = Bitcoind;
