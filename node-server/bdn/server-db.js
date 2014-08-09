var mysql = require('mysql'),
	nconf = require('nconf'),
	utils = require("./lib/Utils");

nconf.env().file({ file: 'db-config.json'});

var dbConfig = nconf.get();

var mySQL = {
	dbname : dbConfig.db,

	connect : function(){
		var conn = mysql.createConnection({
			host: dbConfig.hostname,
			port: dbConfig.port,
			user: dbConfig.user,
			password: dbConfig.password,
			database: dbConfig.db
		});

		conn.connect(function(err) {
			if(err){
				console.error('Connection had errors: ', err.code);
				console.error('Connection params used: hostname = ' +  dbConfig.hostname + ', username = ' + dbConfig.user + ', db = '+  dbConfig.db );
				process.exit(1);
			}
		});

		return conn;
	},

	disconnect : function(conn){
		conn.end();
	},

	debugError: function(fn, error){
		// Generate SOFT error, instead of throwing hard error.
		// We send messages with debug ingo only if in development mode

		if(global.App.mode === 'development'){
			fn({message: {
				text: 'Database error',
				debug: error
			}
			});
		}else{
			fn({message: {
				text: 'Unknown error',
				debug: null
			}
			});
		}
	}
};

mySQL.DB_error_no = function(conn, err, dbType){
	if(typeof dbType === 'undefined') dbType = "MySQL";

	switch(dbType) {
		case "MySQL":
			return (typeof err !== 'undefined')? err.errno : 0;
			break;
		case "MSSQL":
			return 0;
			break;
		default:
			return 0;
	}
}


mySQL.DB_query = function(conn, sql, params, debugMessage, dbType, callback) { //errorMessage,debugMessage,transaction,trapErrors,&err_no,&_err_msg,dbType){
	
	//if(typeof errorMessage === 'undefined') errorMessage = "";
	if(typeof debugMessage === 'undefined') debugMessage = "SQLError: ";
	//if(typeof transaction === 'undefined') transaction = false;
	//if(typeof _err_no === 'undefined') _err_no = 0;
	//if(typeof _err_msg === 'undefined') _err_msg = "";
	if(typeof dbType === 'undefined') dbType = "MySQL";
	
	result = false;

	if(dbType === 'MySQL'){
		// I have set on my.cnf
		// [mysqld]
		// init-connect='SET NAMES utf8'
		// 
		// so that no need to execute below command any more
		// mysqli_query($conn,"SET NAMES 'utf8'");
		
		conn.query(sql, params, function(err, rows, field) {
			if (err) {
				console.log(err);

				var errNo, errMsg;

				errNo = mySQL.DB_error_no(conn, err, dbType);
				switch (errNo) {
					case 1040:
						errMsg = 'Too many connections';
						break;
					case 1062:
						errMsg = 'You have not set or set too small the directive max_allowed_packet in configuration file of MySQL';
						break;
					case 2006:
						errMsg = 'You have not set or set too small the directive max_allowed_packet in configuration file of MySQL';
						break;
					default:
						errMsg = 'something wrong'; //DB_error_msg($conn);
						break;
				}

				utils.addToLogFile(debugMessage + sql);

				utils.addToLogFile("Error: " + errNo + ' - ' + errMsg);
			}

			callback(err, rows, field);
		});
		
	} else if(dbType === 'MSSQL'){
		/*
		$result = sqlsrv_query($conn,$sql);
		
		if ($debugMessage == '') {
			$debugMessage = _('The SQL that failed was');
		}

		if ((DB_error($dbType) !== null) and ($trapErrors)){
			if (!function_exists('addToLogFile')){
				include_once('includes/UtilFunctions.inc');
			}
			if ($trapErrors){
				//require_once('includes/header.inc');
			}
			
			$err = DB_error($dbType);
			$errMsg = $err['message'];
			
			$_err_no = $err['SQLSTATE']; $_err_msg = $errMsg;
			addToLogFile('SQLError:' . $errNo . '. ' . $errMsg . ". sql = '" . $sql . "'");     
			
			//if ($debug==1){
			//  echo ($debugMessage . "<br>$sql<br>",'error',_('Database SQL Failure'));
			//}
			
			if ($transaction){
				$sql = 'rollback';
				DB_query($sql,$conn);
				if (DB_error($conn) !== null){
					addToLogFile('Error Rolling Back Transaction \n Database Rollback Error');
				}
			}

			if ($trapErrors){
				//include_once('includes/footer.inc');
				//exit;
			}
		}
		*/
	}

	//return $result;

}


mySQL.DB_escape_string = function(conn, string, dbType){

	if(typeof dbType === 'undefined') dbType = "MySQL";
	
	if(string.length == 0) return "";
	
	if(dbType === 'MySQL') return conn.escape(string);
	//if(dbType === 'MSSQL') return mssql_escape(string);

	return '';
}


mySQL.DB_data_get_field = function(field_name,table,where,db,dbType,callback){
	
	if(typeof dbType === 'undefined') dbType = "MySQL";

	if(dbType == "MySQL") {
		var conn = db.connect();

		sql =	" SELECT " + field_name +
				" FROM " + table +
				" WHERE " + where;	
		
		db.DB_query(conn, sql, null, 'Error on mySQL.DB_data_get_field > SQL = ', "MySQL", function(err, rows, fields) {
			db.disconnect(conn); //release connection
			if (err) {
				callback(err);
			} else {
				if(rows.length  == 0) {
					callback(err, null);
				} else if(rows.length == 1) {
					callback(err, rows[0][field_name]);
				} else {
					// TO DO
					// Should I return the array of values here ?
					callback(err, rows[0][field_name]);
				}
			}
		});	
	} else {
		callback({errno: 0, errMsg: "Not implement yet"},null);
	}
} // GetFieldFromCode


//test db connection and terminate if connection fails
mySQL.connect();

// Make MySql connections available globally, so we can access them from within modules
//Store inside database property of App
global.App.database = mySQL;