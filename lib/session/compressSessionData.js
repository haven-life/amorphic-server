'use strict';

// TODO: Make a SessionUtils
let AmorphicContext = require('../AmorphicContext');
let zlib = require('zlib');
let amorphicContext = require('../AmorphicContext');
let statsdUtils = require('../stats/StatsdHelper');

/*
 * Compress session data
 */
function compressSessionData(data) {
    let compressSessionDataStartTime = process.hrtime();

    let amorphicOptions = AmorphicContext.amorphicOptions;

    if (amorphicOptions.compressSession) {
        try {
            let sessionData = zlib.deflateSync(data);

            statsdUtils.computeTimingAndSend(
                compressSessionDataStartTime,
                amorphicContext.appContext.statsdClient,
                'amorphic.session.compress_session_data.response_time',
                { result: 'success' });

            return sessionData;
        } catch (e) {
            statsdUtils.computeTimingAndSend(
                compressSessionDataStartTime,
                amorphicContext.appContext.statsdClient,
                'amorphic.session.compress_session_data.response_time',
                { result: 'success' });

            throw e;
        }
    }

    return data;
}

module.exports = {
    compressSessionData: compressSessionData
};
