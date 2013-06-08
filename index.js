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

function loadView (name, callback) {
  if (app.cacheViews && views[name]) {
    callback(views[name]);
    return;
  } else {
    fs.readFile(path + name + '.ejs', function (err, data) {
      if (err) throw err;
      data = data.toString();
      views[name] = data;
      callback(data);
    });
    return;
  }
}
