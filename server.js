var express = require('express');
var app = express();
var mongoose = require('mongoose');

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

// configuration =================
// connect to mongoDB database on modulus.io
mongoose.connect('mongodb://localhost/todo'); 	

// define model =================
var Todo = mongoose.model('Todo', {
	text : String,
	del_flag : Boolean
});

// ROUTES =================
    // API ====================
app.get('/', function(req, res) {
    var r_data = {"res" : "root"};
    res.json(r_data);
});

app.get('/get/todos', function(req, res) {
	// use mongoose to get all todos in the database
	Todo.find(function(err, todos) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err);
		res.json(todos); // return all todos in JSON format
	});
});

// create todo and send back all todos after creation
app.post('/create/todos', function(req, res) {

	// create a todo, information comes from AJAX request from Angular
	Todo.create({
		text : req.body.text,
		done : false
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err);
			res.json(todos);
		});
	});

});

// delete a todo
app.delete('/del/todos/:todo_id', function(req, res) {
	Todo.update({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err);
			res.json(todos);
		});
	});
});

// application --------------------------------------------------
app.get('*', function(req, res) {
	// load the single view file
	// (angular will handle the page changes on the front-end)
	res.sendfile('./public/index.html');
});


//================================================================
app.listen(3000);
console.log("APP LISTENING ON PORT 3000");