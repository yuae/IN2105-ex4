// create server obj
const express = require('express');
const app = express();

//body parser
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//static file dir
app.use(express.static(__dirname+'/res'))

//DB
const org = require('./orgmodel.xml')
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(org,"text/xml");
const db = require('./models');

//routes
//HTML Endpoints
app.get('/ui', function homepage(req, res) {
	res.sendFile(__dirname + '/res/index.html');
  });

//APIs endpoints
app.get('/', (req, res) => {
	res.json({
	  //message: 'Welcome to my app api!',
	  //documentationUrl: '', //leave this also blank for the first exercise
	  //baseUrl: '', //leave this blank for the first exercise
	  endpoints: [
		{method: 'POST', path: '/add', description: 'add new task'},
		{method: 'GET', path: '/ui', description: 'return task list'},
		{method: 'PUT', path: '/task', description: 'assign task'},
		{method: 'DELETE', path: '/task', description: 'do task'}
	]
	})
});

//add new task
app.post('/add', (req, res) => {
	//debug info
	console.log(req.body);
	
	//create new task
	const nTask = new TasksModel ({
		id: req.body.id,
		assignTo: ''
	});
	db.tasks.create(req.body, (err, nTask) => {
		if (err) throw err;
		res.send("New task added");
	});
	
});

//return ui
app.get('/ui', (req, res) => {
	//debug info
	console.log(req.body);
	res.sendFile(__dirname + '/res/index.html');
});

//return all task
app.get('/api/tasks/', (req, res) => {
	db.tasks.find({}, function (err, tasks) {
	  if (err) throw err;
	  res.json(tasks);
	});
});

//return tasklist for specific marnr
app.get('/ui/:matnr', (req, res) => {
	const mat = req.params.id
    var value = $(xmlDoc).find('tester[id="'+mat+'"]');
	console.log(value);
	if (value == null || value=='') {
		res.send("No such tester.");
		return;
	}
	//get task list
	db.tasks.find({}, function (err, tasks) {
		if (err) throw err;
		res.json(tasks);
	});
	/*
	db.tasks.find({_id: mat}, function (err, tasks) {
		if (err) throw err;
		res.json(tasks);
	});*/
});


app.put('/task/:id', (req, res) => {
	//debug info
	console.log(req.body);
	const taskId = req.params.id;
	if (req.task == 'take') {
		const taskNewInfo = req.body;
		console.log(`task ID = ${taskId} \n Assignee = ${taskAssignee}`);
		db.tasks.findOneAndUpdate({_id: taskId}, taskNewInfo, {new: true},
									(err, updatedTaskInfo) => {
			if (err) throw err;
			res.json(updatedTaskInfo);
		});
	}
	/*
	if (req.task == 'return') {
		const taskNewInfo = req.body;
		console.log(`task ID = ${taskId}`);
		db.tasks.findOneAndUpdate({_id: taskId}, taskNewInfo, {new: true},
									(err, updatedTaskInfo) => {
			if (err) throw err;
			res.json(updatedTaskInfo);
		});
	}*/
});

app.delete('/task/:id', (req, res) => {
	//debug info
	console.log(req.body);
	const taskId = req.params.id;
	db.tasks.findOneAndRemove({_id: taskId}, (err, deletedTask) => {
		if (err) throw err;
		res.json(deletedTask);
	});
});


//SERVER 
// listen on the port 
app.listen(process.env.PORT || 123456, () => {
	console.log('Express server is up and running on http://localhost:3000/');
  });