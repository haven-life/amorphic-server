const SupertypeSession = require('supertype').SupertypeSession;

type hrTime = [number, number];

export class StatsdHelper {
    public static convertHRTimeToMilliseconds(hrTime: hrTime): number {
        return hrTime[0] * 1000 + hrTime[1] / 1000000;
    }

    public static computeTimingAndSend(hrTimeStart: hrTime, statsKey: string, tags?): void {
        const statsdClient = SupertypeSession.statsdClient;

        if(statsdClient
            && statsdClient.timing
            && typeof statsdClient.timing === 'function') {

            const processMessageEndTime = process.hrtime(hrTimeStart);
            const totalTimeInMilliseconds = this.convertHRTimeToMilliseconds(processMessageEndTime);
            statsdClient.timing(statsKey, totalTimeInMilliseconds, tags);
        }
    }
}