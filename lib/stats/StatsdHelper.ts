const SupertypeSession = require('supertype').SupertypeSession;
const amorphicContext = require('../AmorphicContext');

type hrTime = [number, number];

export class StatsdHelper {
    public static convertHRTimeToMilliseconds(hrTime: hrTime): number {
        return hrTime[0] * 1000 + hrTime[1] / 1000000;
    }

    public static computeTimingAndSend(hrTimeStart: hrTime, statsKey: string, tags?): void {
        const statsdClient = SupertypeSession.statsdClient;

        if(statsdClient
            && statsdClient.timing
            && typeof statsdClient.timing === 'function'
            && this.isStatsEnabled()) {

            const processMessageEndTime = process.hrtime(hrTimeStart);
            const totalTimeInMilliseconds = this.convertHRTimeToMilliseconds(processMessageEndTime);
            statsdClient.timing(statsKey, totalTimeInMilliseconds, tags);
        }
    }

    private static isStatsEnabled(): boolean {
        console.log("!!! things for ", amorphicContext.amorphicOptions.mainApp, amorphicContext.applicationConfig[amorphicContext.amorphicOptions.mainApp].appConfig.amorphicEnableStatsd)
        return Boolean(amorphicContext.applicationConfig[amorphicContext.amorphicOptions.mainApp].appConfig.amorphicEnableStatsd);
    }
}