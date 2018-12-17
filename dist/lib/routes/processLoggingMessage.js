'use strict';

let AmorphicContext = require('../AmorphicContext');
let Logger = require('../utils/logger');
let getLoggingContext = Logger.getLoggingContext;
let setupLogger = Logger.setupLogger;
let url = require('url');
let persistor = require('persistor');
let semotus = require('semotus');

/**
 * Purpose unknown
 *
 * @param {unknown} req unknown
 * @param {unknown} res unknown
 */
function processLoggingMessage(req, res) {
    let applicationConfig = AmorphicContext.applicationConfig;
    let path = url.parse(req.originalUrl, true).query.path;
    let session = req.session;
    let message = req.body;
    let persistableSemotableTemplate;

    if(semotus) {
        persistableSemotableTemplate = persistor(null, null, semotus);
    }
    else {
        throw new Error('ERROR: Semotus not found. Cannot call processLoggingMessage if this is a daemon app');
    }

    if (!session.semotus) {
        session.semotus = {controllers: {}, loggingContext: {}};
    }

    if (!session.semotus.loggingContext[path]) {
        session.semotus.loggingContext[path] = getLoggingContext(path, null);
    }

    // TODO why can't appConfig be taken out here?
    setupLogger(persistableSemotableTemplate.logger, path, session.semotus.loggingContext[path],
        applicationConfig);

    persistableSemotableTemplate.logger.setContextProps(message.loggingContext);

    persistableSemotableTemplate.logger.setContextProps({
        session: req.session.id,
        ipaddress: (String(req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress)).split(',')[0].replace(/(.*)[:](.*)/, '$2') || 'unknown'});

    message.loggingData.from = 'browser';
    persistableSemotableTemplate.logger[message.loggingLevel](message.loggingData);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('');
}

module.exports = {
    processLoggingMessage: processLoggingMessage
};
