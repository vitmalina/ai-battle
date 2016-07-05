var connection = require('./connection.js');
module.exports = {
	
	handleUpdate : function(req, res) {
		var userid = req.query.userid;
		var fname = req.query.fname;	 
		// fname = fname.replace(/"/g, '\\"');
		// userid = parseInt(userid);

		var sql = `UPDATE users SET fname = ? where userid = ?` ;
		connection.query(sql, [fname, userid], function(err, rows, fields) {
			if (err) console.log("DB ERROR", err);
			//console.log(rows);
			res.send(rows);
			//console.log(err);
		});
	}
		
		
};
