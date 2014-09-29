(function() {

var gui = require('nw.gui');
var notification = require('osx-notifier');
var Datastore = require('nedb');
var exec = require('child_process').exec;
var window = gui.Window.get();
var lurch = {
  execute: exec,
  current: ''
};

var menu = new gui.Menu();
var sitesMenu = new gui.Menu();
var pluginsMenu = new gui.Menu();
var tray = new gui.Tray({
  title: 'Lurch',
  menu: menu
});

// NEdb init
var db = {};

db.sites = new Datastore({
  filename : gui.App.dataPath + '/sites.db',
  autoload: true
});

db.settings = new Datastore({
  filename : gui.App.dataPath + '/settings.db',
  autoload: true
});

// Set global variables
global.menu = menu;
global.sitesMenu = sitesMenu;
global.pluginsMenu = pluginsMenu;
global.$ = $;
global.db = db;
global.gui = gui;
global.window = window;
global.localStorage = localStorage;
global.notification = notification;
global.lurch = lurch;

// Menu functions
var lurchMenu = require('./menu.js');

// Project functions
var projects = require('./projects.js');

// Plugin functions
var plugins = require('./plugins.js');

// Append sites to menu
projects.getProjects(lurch, function() {

  // Insert menu items to main menu
  lurchMenu.populate();

  // Get plugins and insert them into pluginsMenu
  plugins.getPlugins();

});

})();
