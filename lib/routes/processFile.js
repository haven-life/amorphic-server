'use strict';

let Logger = require('../utils/logger');
let logMessage = Logger.logMessage;
let formidable = require('formidable');
let fs = require('fs');
let amorphicContext = require('../AmorphicContext');
let statsdUtils = require('../stats/StatsdHelper').StatsdHelper;

/**
 * Purpose unknown
 *
 * @param {unknown} req unknown
 * @param {unknown} resp unknown
 * @param {unknown} next unknown
 * @param {unknown} downloads unknown
 */
function processFile(req, resp, next, downloads) {
    let processFileTime = process.hrtime();

    if (!downloads) {
        logMessage('no download directory');
        next();

        return;
    }

    let form = new formidable.IncomingForm();
    form.uploadDir = downloads;

    form.parse(req, function ee(err, _fields, files) {
        if (err) {
            logMessage(err);
        }

        resp.writeHead(200, {'content-type': 'text/html'});

        let file = files.file.path;
        logMessage(file);

        setTimeout(function yz() {
            fs.unlink(file, function zy(err) {
                if (err) {
                    logMessage(err);
                }
                else {
                    logMessage(file + ' deleted');
                }
            });
        }, 60000);

        let fileName = files.file.name;
        req.session.file = file;
        resp.end('<html><body><script>parent.amorphic.prepareFileUpload(\'package\');' +
            'parent.amorphic.uploadFunction.call(null, "' +  fileName + '"' + ')</script></body></html>');

        statsdUtils.computeTimingAndSend(
            processFileTime,
            'amorphic.webserver.process_file.response_time',
            { result: 'success' });
    });
}

module.exports = {
    processFile: processFile
};
