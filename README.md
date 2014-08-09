BitMe
=====

Snapcard Challenge

This code is to generate a bitcoin invoice without depending on the central payment processors.

I. Programing Language General

- Node.JS: The backend server
- MySQL: Database >> No need in this challenge
- Sencha Extjs: The front end UI
- ExtDirect: To communicate between front-end and back-end

II. Installation & Run
A.	Back-end:
-	Run server by moving to the folder /BitMe/node-server/bdn then enter node server.js (assume that you got installation of nodejs on your localhost already
-	Notes:
o	Folder ./direct stores API for front-end to call back-end using ExtDirect. The file DXConnectDB.js got function getWallet() to create the bitcoin wallet address randomly and return newly created address to the front-end.
o	Folder./lib stores library. The file task.js got functions to get exchange rate tickers from BitStamp and Balance from Blockchain.
o	Socket.IO is used to updates exchange rates and send invoice payment status to front-end

B.	Frone-End
-	On the browser type: http://127.0.0.1:3000/bdn/app.html to go to the website.
-	On render of the Invoice, the socket shall update the exchange rate to calculate the USD equivalent real-time and up-to-date. Users can enter different amount to textbox “Amount To Send” to see the USD update.
-	When user click on the Pay Now button, the front-end shall request back-end to return bitcoin wallet address and show to QR code in the new pop-up window.
-	Within 1 minute, if user does not pay to the address, the invoice shall expire. Otherwise the invoice status shall become Paid or Partially Paid.

C.	Communication
-	ExtDirect Remote API
-	Web-socket (using socket.io V0.9) to support real time update and 2-way communications for the future features.

D.	Dependencies
-	The following package need to be install with nodejs:
o	Express
o	Bitcoinjs-lib
o	Cron
o	Extdirect
o	Nconf
o	Request
o	Socket.io


III. Full Usage

Seller: who wants to receive payment in Bitcoin for his/her product.

- Step 1: Signup account with BitMe to collect bitcoin-payment. A seller then have URL such as: https:/snapcard.com/pay/bit2Le

- Step 2: Add an icon that lead to the above URL next to his product on any websites or forums, Ex: facebook.

- Step 3: That's it!

Buyer: who wants to pay bitcoin to a seller

- Step 1: Click on the icon next to product. The invoice shows up. The status of invoice is now waiting.

- Step 2: Enter or accept the amount on the invoice, then click the button "Pay Now"

- Step 3: The newly created bitcoin wallet address and its QR Code shows up on the invoice.

- Step 4: Buyer use any bitcoin wallet to scan QR code and pay for the invoice.

- Step 5: The invoice status is updated. Payment is confirmed or expired.


To collect money, a seller just sign in to the BitMe sign and check for newly-created wallets and collect bitcoins (The security can be improved here to protect from unauthorized collection)



