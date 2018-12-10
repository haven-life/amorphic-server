import { Supertype, supertypeClass, amorphicStatic, property, remote } from '../../../../../dist/index';
import * as fs from 'fs';
import * as url from 'url';
@supertypeClass
export class Controller extends Supertype {

    @property()
    prop: Boolean = false;

    @property({
        values: ['value'],
        descriptions: {
            value: 'Description'
        }
    })
    propWithValuesAndDescriptions: String;
    posted: any;

    get virtualProp() {
        return 'I am virtual';
    }

    async serverInit() {
        this.prop = true;
        //  daemonController = this;
        await amorphicStatic.syncAllTables();
    }

    @remote ({on: 'server'})
    async processPost (uri: string, body, request) {
        this.posted = body.myfield;
        return {status: 303, headers: {location: uri.replace(/amorphic.*/, '')}};
    }
    getObjectTemplate() {
        return this.amorphic;
    }

    onContentRequest(req, res) {
        var path = url.parse(req.originalUrl, true).query.file;
        var file = __dirname + '/./' + path;
        try {
            var stat = fs.statSync(file);
        }
        catch (e) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Length': stat.size
        });
        var readStream = fs.createReadStream(file);
        readStream.pipe(res);
    }
}