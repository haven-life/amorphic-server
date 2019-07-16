module.exports.controller = function(objectTemplate, uses) {
	var fs = require('fs');
	var url = require('url');

	var localObjectTemplate = objectTemplate;
	var BaseController = uses('./baseController.js', 'BaseController');
	var MapFromStatic = uses('./static.js', 'map');

	var Controller = BaseController.extend('Controller', {
		prop: { type: Boolean, value: false },
		propWithValuesAndDescriptions: {
			type: String,
			values: ['value'],
			descriptions: {
				value: 'Description'
			}
		},
		virtualProp: {
			type: String,
			isVirtual: true,
			get: function() {
				return 'I am virtual';
			}
		},

		serverInit: function() {
			this.prop = true;
			daemonAutoController = this;
		},

		processPost: {
			on: 'server',
			body: function(uri, body) {
				this.posted = body.myfield;
				return { status: 303, headers: { location: uri.replace(/amorphic.*/, '') } };
			}
		},

		onContentRequest: function(req, res) {
			var path = url.parse(req.originalUrl, true).query.file;
			var file = __dirname + '/./' + path;
			try {
				var stat = fs.statSync(file);
			} catch (e) {
				res.writeHead(404, { 'Content-Type': 'text/plain' });
				res.end('Not found');
				return;
			}
			res.writeHead(200, {
				'Content-Type': 'application/pdf',
				'Content-Length': stat.size
			});
			var readStream = fs.createReadStream(file);
			readStream.pipe(res);
		},

		getMapFromStatic: function() {
			return MapFromStatic;
		},

		getObjectTemplate: function() {
			return localObjectTemplate;
		}
	});

	return {
		Controller: Controller
	};
};
