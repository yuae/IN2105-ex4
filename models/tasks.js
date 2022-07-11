const mongoose = require('mongoose'),
 Schema = mongoose.Schema;

 const TasksSchema = new Schema({
      id: String, 
      assignTo: String
	  //ui: String
});

 const TasksModel = mongoose.model('tasks', TasksSchema);

 module.exports = TasksModel;
