//Set up common namespace for the application
//As this is the global namespace, it will be available across all modules
if(!global['App']){
	global.App = {};
}

var express = require('express'),
	nconf = require('nconf'),
	http = require('http'),
	path = require('path'),

	extdirect = require('extdirect'),
//	db = require('./server-db'),
	socket = require('socket.io'),
	CronJob = require('cron').CronJob,
	Tasks = require('./lib/tasks');

nconf.env().file({ file: 'server-config.json'});

var ServerConfig = nconf.get("ServerConfig"),
	ExtDirectConfig = nconf.get("ExtDirectConfig");

var app = express();

app.configure(function(){

	app.set('port', process.env.PORT || ServerConfig.port);
	app.use(express.logger(ServerConfig.logger));

	if(ServerConfig.enableUpload){
		app.use(express.bodyParser({uploadDir:ServerConfig.fileUploadFolder})); //take care of body parsing/multipart/files
	}

	if(ServerConfig.enableCompression){
		app.use(express.compress()); //Performance - we tell express to use Gzip compression
	}
/*
	if(ServerConfig.enableSessions){
		//Required for session
		app.use(express.cookieParser());
		
		app.use(express.session({ secret: ServerConfig.sessionSecret, store: store, cookie: { secure: false, maxAge:86400000 } }));
	}
*/
	app.use(express.methodOverride());

	app.use(express.static(path.join(__dirname, ServerConfig.webRoot)));
});

//CORS Supports
if(ServerConfig.enableCORS){

	app.use( function(req, res, next) {
		res.header('Access-Control-Allow-Origin', ServerConfig.AccessControlAllowOrigin); // allowed hosts
		res.header('Access-Control-Allow-Methods', ServerConfig.AccessControlAllowMethods); // what methods should be allowed
		res.header('Access-Control-Allow-Headers', ServerConfig.AccessControlAllowHeaders); //specify headers
		res.header('Access-Control-Allow-Credentials', ServerConfig.AccessControlAllowCredentials); //include cookies as part of the request if set to true
		res.header('Access-Control-Max-Age', ServerConfig.AccessControlMaxAge); //prevents from requesting OPTIONS with every server-side call (value in seconds)

		if (req.method === 'OPTIONS') {
			res.send(204);
		}
		else {
			next();
		}
	});
}

//GET method returns API
app.get(ExtDirectConfig.apiPath, function(request, response) {
	try{
		var api = extdirect.getAPI(ExtDirectConfig);
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.end(api);
	}catch(e){
		console.log(e);
	}
});

// Ignoring any GET requests on class path
app.get(ExtDirectConfig.classPath, function(request, response) {
	response.writeHead(200, {'Content-Type': 'application/json'});
	response.end(JSON.stringify({success:false, msg:'Unsupported method. Use POST instead.'}));
});

// POST request process route and calls class
app.post(ExtDirectConfig.classPath, function(req, resp) {
	extdirect.processRoute(req, resp, ExtDirectConfig);
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	global.App.mode = 'development';
});

app.configure('production', function(){
	app.use(express.errorHandler());
	global.App.mode = 'production';
});

// Setup Socket IO for updating bitcoin rates and checking invoice payment status
var io = socket.listen(http.createServer(app).listen(app.get('port'), function(){
	console.log("Welcome. Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
}));

io.sockets.on('connection', function(socket) {
	// On socket connection return the latest exchange rate.
	// Then the exchange rates shall be updated automatically on change
	socket.emit('update_exchange_rate', Tasks.getLastBtcUsdRate());

	// Trigger checking invoice payment status within presetting period
	// prior to expire.
	socket.on('check_invoice_status', function(data) {
		// Debug: console.log('Invoice status requested!');console.log(data);
		
		Tasks.checkInvoiceStatus(data, socket);
	})
});

// Start global process to update bitcoin exchange rates
new CronJob('*/10 * * * * *', function() {
	console.log('Rates shall be checked every 10 second');
	console.log(Tasks.getLastBtcUsdRate());

	Tasks.ticker(io.sockets);
}, null, true, "America/Los_Angeles");
