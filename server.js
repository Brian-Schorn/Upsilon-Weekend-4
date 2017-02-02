var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var config = { database: "todoList" };
var pool = new pg.Pool(config);

app.use( express.static('public'));
app.use( bodyParser.urlencoded({extended: true}));


app.listen( 3000, function(){
  console.log( 'Server Loaded' );
});

app.get( '/', function( req, res ){
  res.sendFile(path.resolve('public/views/index.html'));
  console.log( 'index.html Loaded' );
});

//Add a new To Do
app.post( '/newToDo', function(req, res){

  pool.connect(function( err, client, done ){
    if( err ){
      console.log("Error connecting to Server:", err );
      res.sendStatus( 500 );
      done();
    }
    else {
      console.log( 'db connect');
      client.query( "INSERT INTO todolist (name, finished) values ( $1, $2 )", [ req.body.ToDoName, false ] );
      done();
      res.sendStatus( 200 );
    }
  });
});

//Get To Dos from Server
app.get( '/getToDo', function(req, res){

  var list = [];

  pool.connect(function( err, client, done ){
    if( err ){
      console.log("Error connecting to Server:", err );
      res.send( 500 );
      done();
    }
    else{

      var allRows = client.query( "SELECT * FROM todolist ORDER BY finished ASC" );
      allRows.on('row', function(todo){
        list.push(todo);
      });
      allRows.on( 'end', function(){
        done();
        res.send(list);
      });
    }
  });
});

//Complete To Dos
app.put( '/completeToDo', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log("Error connecting to Server:", err);
      res.sendStatus(500);
    }
    else{

      client.query( "UPDATE todolist SET finished=true WHERE id=" + req.body.id );
      done();
      res.sendStatus( 200 );
    }
  });
});

//Delete To Dos
app.delete( '/deleteToDo', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log("Error connecting to Server:", err);
      res.sendStatus(500);
    }
    else{
      console.log("Delete:",req.body);
      client.query( "DELETE from todolist WHERE id=" + req.body.id );
      done();
      res.sendStatus( 200 );
    }
  });
});
