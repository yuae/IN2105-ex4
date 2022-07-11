// GLOBAL VARIABLES
const results = document.getElementById('results');
const uiURL = '/ui';
const taskURL = '/task';
var matnr;

const render = (tasks) => {
  results.innerHTML = '';

  const task = tasks.forEach(task => {
	if (task.assignTo===''){
		results.insertAdjacentHTML('afterbegin', `
					<div id=${task.id} style="padding: 40px">
						<p>ID : <strong>${task.id}</strong></p>
						<p id=${task.id}-assign>Assign To: <strong>${task.assignTo}</strong></p>
						<button id="${task._id}-take">Take</button>
						<button id="${task._id}-refuse">Refuse</button>
					</div>
		`);
	}
	else{
		results.insertAdjacentHTML('afterbegin', `
					<div id=${task.id} style="padding: 40px">
						<p>ID : <strong>${task.id}</strong></p>
						<p id=${task.id}-assign>Assign To: <strong>${task.assignTo}</strong></p>
						<button id="${task._id}-do">Do</button>
						<button id="${task._id}-return">Return</button>
					</div>
		`);
	}
  })
};

// GET ALL Tasks
const getTasks = () => {
  fetch(taskURL)
    .then(res => res.json())
    .then(tasks => render(tasks))
    .catch(err => console.log(err));
};

// get tasklist
const handleSubmit = (event) => {
  event.preventDefault();
  console.log('Form submitted!');
  matnr = document.getElementById('matnr').value;
  //const data = {
    //id: matnr
  //};
  console.log(matnr);

  fetch(uiURL + event.target.id)
    .then(res => res.json())
    .then(tasks => render(tasks))
    .catch(err => console.log(err));
};

const handleAction = (event) => {
	if (event.target.innerText === 'Refuse' || event.target.innerText === 'Do') {
	  console.log('Refuse/Do Clicked!');
	  console.log(event.target.id);
	  targetID = event.target.id.toString();
	  id = targetID.subString(0, targetID.indexOf('-'))
	  console.log(taskURL + id);
	  fetch(baseURL + id, {
		method: 'delete',
	  })
		.then(() => getTasks())
		.catch(err => console.log(err));
	} else if (event.target.innerText === 'Take') {
	  console.log('Take Clicked!');
	  const parent = event.target.parentNode;
	  const tID = parent.children[0].children[0].innerText;
	  const tAssignTo = matnr;
	  const data = {
		id: tID, 
		assignTo: tAssignTo
	  };
	  fetch(baseURL + taskId, {
		method: 'PUT',
		headers: {
		'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(data),
		})
		.then(() => gettasks());
	}
	else {
	  console.log('Return Clicked!');
	  const parent = event.target.parentNode;
	  const tID = parent.children[0].children[0].innerText;
	  const data = {
		id: tID, 
		assignTo: ''
	  };
	  fetch(baseURL + taskId, {
		method: 'PUT',
		headers: {
		'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(data),
		})
		.then(() => gettasks());
	}
  };

// EVENT LISTENERS
form.addEventListener('submit', handleSubmit);
results.addEventListener('click', handleAction);
