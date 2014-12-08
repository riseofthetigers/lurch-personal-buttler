(function() {

var gui = require('nw.gui');
var notification = require('osx-notifier');
var Datastore = require('nedb');
var exec = require('child_process').exec;
var nwWindow = gui.Window.get();
nwWindow.setShowInTaskbar(false);

var Project = require('./lib/Project/Project.js');
var Menu = require('./lib/Menu/Menu.js');

// NEdb init
var db = {};

db.projects = new Datastore({
  filename: gui.App.dataPath + '/projects.db',
  autoload: true
});

db.plugins = new Datastore({
  filename: gui.App.dataPath + '/plugins.db',
  autoload: true
});

// Set global variables
global.$ = $;
global.db = db;
global.gui = gui;
global.nwWindow = nwWindow;
global.notification = notification;
global.localStorage = localStorage;
global.projectEditId = null;

// Plugin API
var lurch = {
  execute: exec,
  current: ''
};

// Load current
Project.findCurrent(function(err, project) {
  if (project) {
    lurch.current = project;
  } else {
    lurch.current = { name: 'None selected' };
  }
});
global.lurch = lurch;

// Create a new menu
var menu = new Menu();
menu.addToTray();
menu.populate();

// Set REST token if not set
require('./rest/rest-api.js').setToken();

// Hide window on close
nwWindow.on('close', function() {
  this.setShowInTaskbar(false);
  this.hide();
});

})();
