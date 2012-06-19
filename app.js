
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    TaskProvider = require('./taskprovider-inmemory.js').TaskProvider;

var taskProvider = new TaskProvider();
var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
    taskProvider.findColumnsAndTasks(function(error, cols, tasks1) {
        res.render('index.jade', {
            title: "Kanban", //todo take from configuration
            columns: cols,
            tasks: tasks1
        });
    });
});

app.post('/movetask', function(req, res) {
    var movecmd = req.body;
    taskProvider.moveTask(movecmd, function(fooerr, footasks){ res.redirect('/'); });
});

app.post('/removetask', function(req, res) {
    var cmd = req.body;
    taskProvider.removeTask(cmd, function(fooerr, footasks){ res.redirect('/'); });
});

app.post('/assigntask', function(req, res) {
    var cmd = req.body;
    taskProvider.assignTask(cmd, function(fooerr){ res.redirect('/'); });
});

app.post('/addtask', function(req, res) {
    var cmd = req.body;
    taskProvider.addTask(cmd, function(error) { res.redirect('/') });
});

app.listen(3000, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
