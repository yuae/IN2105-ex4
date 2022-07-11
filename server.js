// create server obj
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();

//body parser
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//static file dir
app.use(express.static(__dirname+'/res'))

//DB
//const db = require('./models');
const tasklist = require('./data/tasklist.json')

//routes
//HTML Endpoints
app.get('/ui', function homepage(req, res) {
	res.sendFile(__dirname + '/views/index.html');
  });

//APIs endpoints
app.get('/', (req, res) => {
	res.json({
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
	console.log(req.headers)
	console.log(req.body);
	
	//create new task
	const nTask = {
		'id': req.body.id,
		'assignTo': '',
		'callback': req.headers.cpee-callback
	};
	var file = './data/tasklist.json';
	var tasks = JSON.parse(fs.readFileSync(file).toString());
	console.log(tasks);
	tasks.push(nTask);
	fs.writeFileSync(file, JSON.stringify(tasks));
	res.send("New task added");
	//list =JSON.parse(tasklist);
	//list.push(nTask)
	/*
	db.tasks.create(req.body, (err, nTask) => {
		if (err) throw err;
		res.send("New task added");
	});
	*/
});

//return ui
app.get('/ui', (req, res) => {
	//debug info
	console.log(req.body);
	res.sendFile(__dirname + '/res/index.html');
});

app.get('/ui/:id', (req, res) => {
	console.log(req)
	const mat = req.params.id
	const org = './orgmodel.xml';
	let xmlDoc = fs.readFileSync(org, "utf8");
	let arr = xmlDoc.split(/\r?\n/);
	var found = false;
	arr.forEach((line, idx)=> {
		if(line.includes(mat)){
			found = true;
		}
	});
	console.log(found);
	if (!found) {
		res.send("No such tester.");
		return;
	}
	var file = './data/tasklist.json';
	var tasks = JSON.parse(fs.readFileSync(file).toString());
	console.log(tasks);
	res.json(tasks);
	/*
	//get task list
	db.tasks.find({}, function (err, tasks) {
		if (err) throw err;
		res.json(tasks);
	});
	list =JSON.parse(tasklist);*/
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
	const taskAssignee = req.body.assignTo;
	console.log(`task ID = ${taskId} \n Assignee = ${taskAssignee}`);
	//fs = require('fs');
	var file = './data/tasklist.json';
	var tasks = JSON.parse(fs.readFileSync(file).toString());
	for (const item of tasks) {
		if (taskId==item.id){
			item.assignTo = taskAssignee;
			console.log(item);
			updatedTaskInfo = item;
			break;
		}
	}
	console.log("updated:")
	console.log(updatedTaskInfo);
	fs.writeFileSync(file, JSON.stringify(tasks));
	res.json(updatedTaskInfo);
	/*
	db.tasks.findOneAndUpdate({_id: taskId}, taskNewInfo, {new: true},
								(err, updatedTaskInfo) => {
		if (err) throw err;
		res.json(updatedTaskInfo);
	});*/
});

app.delete('/task/:id', (req, res) => {
	//debug info
	console.log(req.body);
	const taskId = req.params.id;
	var file = './data/tasklist.json';
	var tasks = JSON.parse(fs.readFileSync(file).toString());
	var index = 0;
	var found = false;
	for (const item of tasks) {
		if (taskId==item.id){
			found=true;
			break;
		}
		index++;
	}
	if(found) {
		dTask = tasks[index];
		tasks.splice(index,1);
		console.log(tasks);
		fs.writeFileSync(file, JSON.stringify(tasks));
		axios
		.post(dTask.callback, {
			message: 'task removed'
		})
		.then(res => {
			console.log(`statusCode: ${res.status}`);
			console.log(res);
		})
		.catch(error => {
			console.error(error);
		});
		res.send("task deleted");
	}

	/*
	db.tasks.findOneAndRemove({_id: taskId}, (err, deletedTask) => {
		if (err) throw err;
		res.json(deletedTask);
	});*/
});


//SERVER 
// listen on the port 
app.listen(process.env.PORT || 12345, () => {
	console.log('Express server is up and running on http://localhost:12345/');
  });