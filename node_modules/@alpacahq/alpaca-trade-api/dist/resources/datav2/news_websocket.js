"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlpacaNewsCLient = void 0;
const websocket_1 = require("./websocket");
const entityv2_1 = require("./entityv2");
const websocket_2 = require("./websocket");
class AlpacaNewsCLient extends websocket_2.AlpacaWebsocket {
    constructor(options) {
        const url = "wss" + options.url.substr(options.url.indexOf(":")) + "/v1beta1/news";
        options.url = url;
        options.subscriptions = {
            news: [],
        };
        super(options);
    }
    subscribeForNews(news) {
        this.session.subscriptions.news.push(...news);
        this.subscribe(news);
    }
    subscribe(news) {
        const subMsg = {
            action: "subscribe",
            news,
        };
        console.log("subscribing", subMsg);
        this.conn.send(this.msgpack.encode(subMsg));
    }
    subscribeAll() {
        if (this.session.subscriptions.news.length > 0) {
            this.subscribe(this.session.subscriptions.news);
        }
    }
    unsubscribeFromNews(news) {
        this.session.subscriptions.news = this.session.subscriptions.news.filter((n) => !news.includes(n));
        this.unsubscribe(news);
    }
    unsubscribe(news) {
        const unsubMsg = {
            action: "unsubscribe",
            news,
        };
        this.conn.send(this.msgpack.encode(unsubMsg));
    }
    updateSubscriptions(msg) {
        this.log(`listening to streams:
        news: ${msg.news}`);
        this.session.subscriptions = {
            news: msg.news,
        };
    }
    onNews(fn) {
        this.on(websocket_1.EVENT.NEWS, (n) => fn(n));
    }
    dataHandler(data) {
        data.forEach((element) => {
            if ("T" in element) {
                switch (element.T) {
                    case "n":
                        this.emit(websocket_1.EVENT.NEWS, (0, entityv2_1.AlpacaNews)(element));
                        break;
                    default:
                        this.emit(websocket_1.EVENT.CLIENT_ERROR, websocket_1.ERROR.UNEXPECTED_MESSAGE);
                }
            }
            else {
                this.emit(websocket_1.EVENT.CLIENT_ERROR, websocket_1.ERROR.UNEXPECTED_MESSAGE);
            }
        });
    }
}
exports.AlpacaNewsCLient = AlpacaNewsCLient;
