var walk = require('walkdir');

/**
 * Function to get plugins and pass them to the menu
 */
module.exports.buildMenu = function(newPlugin) {

  db.plugins.find({}, function(error, plugins) {

    // Add newly added plugin to plugins array.
    if (newPlugin) {
      plugins.push(newPlugin);
    }

    // Loop all plugins and build the plugins menu.
    for (var key in plugins) {
      var item = new gui.MenuItem({
        type: 'normal',
        label: plugins[key].name
      });

      item.on('click', function() {
        for (var id in pluginsMenu.items) {
          if (pluginsMenu.items[id] == this) {
            runPlugin(plugins[id].path);
          }
        }
      });

      pluginsMenu.append(item);
    }
  });
}

/**
 * Function for rebuild menu
 */
module.exports.rebuildMenu = function() {
  // Rebuild menu
  // Remove current items
  var max = pluginsMenu.items.length;
  if (max == 0) {
    module.exports.buildMenu();
  } else {
    for (var i = 0; i < max; i++) {
      pluginsMenu.removeAt(0);

      if ((i+1) == max) {
        // Build menu items again
        module.exports.buildMenu();
      }
    }
  }
}

/**
 * Get plugins.
 */
module.exports.getPlugins = function(callback) {
  db.plugins.find({}, function(error, plugins) {
    callback(plugins);
  });
}

/**
 * Function for running a plugin.
 */
var runPlugin = function(path) {
  var pluginInfo = require(path + '/package.json');
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

/**
 * Remove plugin
 */
module.exports.remove = function(id, callback) {
  db.plugins.remove({ _id: id }, function() {

    db.sites.find({ plugins: { $in: [id] }}, function(err, projects) {

      if (projects.length < 1) {
        callback();
      }

      for (var key in projects) {

        var projectPlugins = projects[key].plugins;

        for (var pluginKey in projectPlugins) {

          if (projectPlugins[pluginKey] == id) {
            var popKey = parseInt(pluginKey);
            popKey++;
            db.sites.update({ _id: projects[key]._id }, { $pop: { plugins: popKey } }, {}, function(err) {
              callback();
            });

          }

        }

      }

    });

  });
}

/**
 * Add plugin
 */
module.exports.add = function(name, dest, callback) {
  db.plugins.insert({
    name: name,
    path: dest
  }, function(error, newDoc) {
    if (!error) {
      callback(newDoc);
    }
  });
}
