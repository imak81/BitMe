var Request = require('request');

var lastBtcUsdRate = 0;

var Tasks = {
	getLastBtcUsdRate: function() {
		return lastBtcUsdRate;
	},

	ticker: function(sockets){
		Request('https://www.bitstamp.net/api/ticker/', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				
				if(JSON.parse(body).last) {
					// Just update when a rate changes
					if(lastBtcUsdRate != JSON.parse(body).last) {
						lastBtcUsdRate = JSON.parse(body).last;

						// Send to all client
						sockets.emit('update_exchange_rate', lastBtcUsdRate);

						console.log('ticker');
					}
				} else {
					console.log('Warning: Can not get exchange rate from remote server');
					// TODO:
					//	Connect to backup server ?
				}

			} else {
				console.log('Error: Can not get exchange rate from remote server: ' + error);
			}
		});
	},

	checkInvoiceStatus: function(data, socket) {
		var count = 0,
			owingAmount = requestedAmount = parseFloat(data.totalamount);

		var refreshIntervalId = setInterval(function() {
			count++;

			console.log('checkInvoiceStatus:')
			console.log(data);

			Request('https://blockchain.info/rawaddr/' + data.bitaddress, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(JSON.parse(body));
					if(JSON.parse(body).final_balance !== undefined) {
						var paidAmount = parseFloat(JSON.parse(body).final_balance);

						console.log(paidAmount);
						
						// Test:
						// paidAmount = 0.5;

						if(paidAmount > 0) {
							owingAmount = requestedAmount - paidAmount;

							if(owingAmount > 0) {
								// Send to individual client
								socket.emit('update_invoice_status', {bitaddress: data.bitaddress, status: 'partiallypad'});

							} else {
								// Send to individual client
								socket.emit('update_invoice_status', {bitaddress: data.bitaddress, status: 'paid'});
							}

							// Stop asking status
							clearInterval(refreshIntervalId);
						}
					} else {
						console.log('Warning: Can not get wallet balance from remote server');
						// TODO:
						//	Connect to backup server ?
					}

				} else {
					console.log('Error: Can not get wallet balance from remote server: ' + error);
				}
			})

			if(count == 6) {
				clearInterval(refreshIntervalId);

				// Send to individual client
				socket.emit('update_invoice_status', {bitaddress: data.bitaddress, status: 'expired'});
			}

		}, 10000);
	}
};

module.exports = Tasks;