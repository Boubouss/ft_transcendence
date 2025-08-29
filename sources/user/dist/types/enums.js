"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerEvent = exports.ClientEvent = void 0;
var ClientEvent;
(function (ClientEvent) {
    ClientEvent["SEND"] = "SEND";
    ClientEvent["ACCEPT"] = "ACCEPT";
    ClientEvent["DECLINE"] = "DECLINE";
})(ClientEvent || (exports.ClientEvent = ClientEvent = {}));
var ServerEvent;
(function (ServerEvent) {
    ServerEvent["LIST"] = "LIST";
    ServerEvent["CONNECT"] = "CONNECT";
    ServerEvent["DECONNECT"] = "DECONNECT";
    ServerEvent["REQUEST"] = "REQUEST";
    ServerEvent["ACCEPTED"] = "ACCEPTED";
    ServerEvent["DECLINED"] = "DECLINED";
    ServerEvent["ERROR"] = "ERROR";
})(ServerEvent || (exports.ServerEvent = ServerEvent = {}));
