import { supertypeClass, remote, property } from '../../../../../index';
import * as fs from 'fs';
import * as url from 'url';
declare var daemonController;

@supertypeClass({ toClient: true, toServer: true })
export class Controller {

    @property({length: 40, rule: ["name", "required"]})
    prop: Boolean = false;

    public serverInit() {
        this.prop = true;
        daemonController = this;
    }

    @remote({on: "server"})
    processPost(uri) {
        return {status: 303, headers: {location: uri.replace(/amorphic.*/, '')}};
    }

    @remote({on: "server"})
    onContentRequest(req, res) {
        const path = url.parse(req.originalUrl, true).query.file;
        const file = __dirname + '/./' + path;
        try {
            const stat = fs.statSync(file);
        }
        catch (e) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
        });
        let readStream = fs.createReadStream(file);
        readStream.pipe(res);
    }
}