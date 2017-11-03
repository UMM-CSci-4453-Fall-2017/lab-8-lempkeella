var express=require('express'),
mysql=require('mysql'),
credentials=require('./credentials.json'),
app = express(),
port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials
var databaseName = "schr1230";

var connection = mysql.createConnection(credentials); // setup the connection

connection.connect(function(err){if(err){console.log(err)}});

app.use(express.static(__dirname + '/public'));

app.get("/buttons",function(req,res){
  var sql = mysql.format('SELECT * FROM ??.till_buttons', databaseName);
  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an error:");
             console.log(err);}
     res.send(rows);
  }})(res));
});


app.get("/click",function(req,res){
  var id = req.param('id');
  var sql = 'YOUR SQL HERE'
  console.log("Attempting sql ->"+sql+"<-");

  connection.query(sql,(function(res){return function(err,rows,fields){
     if(err){console.log("We have an insertion error:");
             console.log(err);}
     res.send(err); // Let upstream know how it went
  }})(res));
});

app.get("/transaction" , function(req,res) {
  connection.query("select itemId,count(itemId) as count,price, item from "+databaseName+ ".transaction," +databaseName+ ".prices," +databaseName+ ".inventory"+
			" where prices.id=itemId AND itemId=inventory.id group by itemId;", function(err,rows,field) {
	  if(err) {
		console.log("Error: ");
		console.log(err);
	    } else {
		res.send(rows);
	  }
	});
});

// Your other API handlers go here!

app.listen(port);
