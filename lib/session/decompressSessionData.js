'use strict';

let AmorphicContext = require('../AmorphicContext');
let zlib = require('zlib');
let amorphicContext = require('../AmorphicContext');
let statsdUtils = require('../stats/StatsdHelper');

/**
 * Purpose unknown
 *
 * @param {unknown} objData unknown
 *
 * @returns {unknown} unknown
 */
function decompressSessionData(objData) {
    let decompressSessionDataStartTime = process.hrtime();

    let amorphicOptions = AmorphicContext.amorphicOptions;
    if (amorphicOptions.compressSession && objData.data) {
        try {
            let buffer = new Buffer(objData.data);

            let decompressedData = zlib.inflateSync(buffer);

            statsdUtils.computeTimingAndSend(
                decompressSessionDataStartTime,
                amorphicContext.appContext.statsdClient,
                'amorphic.session.decompress_session_data.response_time',
                { result: 'success' });

            return decompressedData;

        } catch (e) {
            statsdUtils.computeTimingAndSend(
                decompressSessionDataStartTime,
                amorphicContext.appContext.statsdClient,
                'amorphic.session.decompress_session_data.response_time',
                { result: 'failure' });

            throw e;
        }
    }

    return objData;
}

module.exports = {
    decompressSessionData: decompressSessionData
};
