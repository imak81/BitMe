
var bitcoin = require('bitcoinjs-lib');

//var db = global.App.database;

var DXConnectDB  = {
	// method signature has 5 parameters
	/**
	 *
	 * @param params object with received parameters
	 * @param callback callback function to call at the end of current method
	 * @param sessionID - current session ID if "enableSessions" set to true, otherwise null
	 * @param request only if "appendRequestResponseObjects" enabled
	 * @param response only if "appendRequestResponseObjects" enabled
	 */

	/************************************************************************************/
	getWallet: function(params, callback, sessionID, req, resp) {
		var data,
			resutls = {};
		
		var key = bitcoin.ECKey.makeRandom();

		var privWIF = key.toWIF(),
			btcAddr = key.pub.getAddress().toString();


		// Print private key (in WIF format)
		console.log(privWIF);	// Ex: => Kxr9tQED9H44gCmp6HAdmemAzU3n84H3dGkuWTKvE23JgHMW8gct

		// Print public key (toString defaults to a Bitcoin address)
		console.log(btcAddr);	// Ex: => 14bZ7YWde4KdRb5YN7GYkToz3EHVCvRxkF

		return callback({
			success: true,
			data: {
				bitcoinaddress: btcAddr
			}
		});
	},
};

module.exports = DXConnectDB;