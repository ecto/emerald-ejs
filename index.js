var fs = require('fs');
var ejs = require('ejs');
var app = process.app || {};

app.cacheViews = false;
var views = {};
var path = 'views/';

module.exports = function (req, res) {
  res.render = function (view, options) {
    options = options || {};
    var layout = options.layout || 'layout';

    loadView(view, function (bodyStr) {
      var body = ejs.render(bodyStr, options);
      options.body = body;

      loadView(layout, function (layoutStr) {
        var ret = ejs.render(layoutStr, options);
        res.end(ret);

      });
    });
  }
}

function loadView (name, callback, force) {
  var fullName = path + name + '.ejs';

  if (app.cacheViews && views[name] && !force) {
    callback(views[name]);
    return;
  }

  fs.readFile(fullName, function (err, data) {
    if (err) throw err;
    data = data.toString();
    views[name] = data;
    callback(data);

    fs.watchFile(fullName, function (curr, prev) {
      loadView(name, function () {}, true);
    });
  });
}
