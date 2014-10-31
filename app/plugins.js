var walk = require('walkdir');

/**
 * Function to get plugins and pass them to the menu
 */
module.exports.buildMenu = function() {
  var findPlugins = walk(gui.App.dataPath + '/Plugins', {no_recurse: true}).on('directory', function(path, stat) {
    var pluginInfo = require(path + '/package.json');

    pluginsMenu.append(new gui.MenuItem({
      type: 'normal',
      label: pluginInfo.name,
      click: function() {
        runPlugin(path, pluginInfo);
      }
    }));
  });
}

/**
 * Get plugins
 */
module.exports.getPlugins = function(callback) {
  db.plugins.find({}, function(error, plugins) {
    callback(plugins);
  });
}

/**
 * Function for running a plugin
 */
var runPlugin = function(path, pluginInfo) {
  var plugin = require(path + '/' + pluginInfo.main);
  plugin.run(lurch, function(response) {
    notification({
      type: response.success ? 'pass' : 'fail',
      title: pluginInfo.name,
      message: response.message,
      group: 'Lurch'
    });
  });
}

// Export the function
module.exports.runPlugin = runPlugin;
