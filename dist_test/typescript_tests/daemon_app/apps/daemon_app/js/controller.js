"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../../../../../index");
var fs = require("fs");
var url = require("url");
var Controller = /** @class */ (function () {
    function Controller() {
        this.prop = false;
    }
    Controller.prototype.serverInit = function () {
        this.prop = true;
        daemonController = this;
    };
    Controller.prototype.processPost = function (uri) {
        return { status: 303, headers: { location: uri.replace(/amorphic.*/, '') } };
    };
    Controller.prototype.onContentRequest = function (req, res) {
        var path = url.parse(req.originalUrl, true).query.file;
        var file = __dirname + '/./' + path;
        try {
            var stat = fs.statSync(file);
        }
        catch (e) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
        }
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
        });
        var readStream = fs.createReadStream(file);
        readStream.pipe(res);
    };
    __decorate([
        index_1.property({ length: 40, rule: ["name", "required"] }),
        __metadata("design:type", Boolean)
    ], Controller.prototype, "prop", void 0);
    __decorate([
        index_1.remote({ on: "server" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Controller.prototype, "processPost", null);
    __decorate([
        index_1.remote({ on: "server" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Controller.prototype, "onContentRequest", null);
    Controller = __decorate([
        index_1.supertypeClass({ toClient: true, toServer: true })
    ], Controller);
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map