TaskProvider = function(){};

TaskProvider.prototype.columns = [{"id": "t", "label": "todo", "css": {backgroundColor: 'white', color: "darkgray"}},
	                              {"id": "i", "label": "in progress", "css": {"backgroundColor": "white", "color": "red"}},
	                              {"id": "d", "label": "done", "css": {color: "green"}}];

TaskProvider.prototype.tasks = [{"column": "t", "task": "todo task", "assign": "foo1"},
                                {"column": "t", "task": "todo 2", "assign": "foo2"},
	                            {"column": "i", "task": "working..", "assign": "foo3"},
	                            {"column": "i", "task": "working2..", "assign": "foo4"},
	                            {"column": "d", "task": "all done..", "assign": ""}];


TaskProvider.prototype.findColumnsAndTasks = function(callback) {
  callback(null, this.columns, this.tasks)
};

TaskProvider.prototype.groupTasksByColumn = function() {
  var groupedTasks = [];
  for (var i in this.columns) {
    groupedTasks[this.columns[i].id] = [];
  }
  for (var i in this.tasks) {
    groupedTasks[this.tasks[i].column].push(this.tasks[i]);
  }
  return groupedTasks;
};

TaskProvider.prototype.ungroupTasksByColumn = function(groupedTasks) {
  var newTasks = [];
  for (var i in this.columns) {
    newTasks = newTasks.concat(groupedTasks[this.columns[i].id]);
  }
  return newTasks;
};

TaskProvider.prototype.setTasks = function(tasks, callback) {
  if (typeof(tasks.length)=="undefined") tasks = [tasks];
  this.tasks = tasks;
  callback(null, this.tasks);
};

TaskProvider.prototype.removeTaskByTaskStr = function (taskStr) {
  var pos = this.findTaskIdx(taskStr);
  this.tasks.splice(pos, 1);
};

TaskProvider.prototype.findTaskIdx = function(taskStr) {
  var pos = -1;
  for (var i in this.tasks) {
    pos = i;
    if (taskStr == this.tasks[i].task) break;  
  }    
  return pos;
};

TaskProvider.prototype.moveTask = function(movecmd, callback) {
  this.removeTaskByTaskStr(movecmd.task.task);
  var groupedTasks = this.groupTasksByColumn();
  groupedTasks[movecmd.task.column].splice(parseInt(movecmd.newindex, 10), 0, movecmd.task);
  this.tasks = this.ungroupTasksByColumn(groupedTasks);
  callback(null, true);
  this.printTasksToConsole();
};

TaskProvider.prototype.printTasksToConsole = function() {
  for (var i in this.tasks) { 
      console.log(JSON.stringify(this.tasks[i])); 
  }
  console.log("------------" + this.tasks.length + " tasks -----");
}; 

TaskProvider.prototype.assignTask = function(cmd, callback) {
  var task = this.findTask(cmd.column, parseInt(cmd.index, 10)-1)
  if (task != null) {
    task.assign = cmd.towho;
    callback(null);
  }
  else {
    console.log("task not found");
    callback("task not found");
  } 
}

TaskProvider.prototype.removeTask = function(cmd, callback) {
  var groupedTasks = this.groupTasksByColumn();
  var zerobasedIndex = parseInt(cmd.index, 10) - 1;
  groupedTasks[cmd.column].splice(zerobasedIndex, 1);
  this.tasks = this.ungroupTasksByColumn(groupedTasks);
  callback(null);
}

TaskProvider.prototype.addTask = function(cmd, callback) {
  var task = {column: cmd.column, task: cmd.desc, assign: cmd.assignTo};
  var zerobasedIndex = parseInt(cmd.index, 10) - 1;
  
  if (this.hasColumn(task.column)) {
    var groupedTasks = this.groupTasksByColumn();
    
    if (zerobasedIndex >= groupedTasks[task.column].length) {
      groupedTasks[task.column].push(task);
    }
    else {
      groupedTasks[task.column].splice(zerobasedIndex, 0, task);
    }
    
    this.tasks = this.ungroupTasksByColumn(groupedTasks);
    callback(null);
  }
  else {
    callback("column does not exist");  
  }
    
};

TaskProvider.prototype.hasColumn = function(colId) {
  for (var i in this.columns) {
    if (colId == this.columns[i].id) return true;  
  }
  return false;
};

TaskProvider.prototype.taskCountInColumn = function(colId) {
  var count = 0;
  for (var i in this.tasks) {
    if (colId == this.tasks[i].column) ++count;  
  }
  return count;
};

TaskProvider.prototype.findTask = function(colId, index) {
  var count = -1;
  for (var i in this.tasks) {
    if (colId == this.tasks[i].column) {
      ++count;  
      if (count == index) return this.tasks[i];
    }
  }
  return null;
};

exports.TaskProvider = TaskProvider;