import { AlpacaNews, RawAlpacaNews } from "./entityv2";
import { AlpacaWebsocket as Websocket, WebsocketOptions } from "./websocket";
export declare class AlpacaNewsCLient extends Websocket {
    constructor(options: WebsocketOptions);
    subscribeForNews(news: Array<string>): void;
    subscribe(news: Array<string>): void;
    subscribeAll(): void;
    unsubscribeFromNews(news: Array<string>): void;
    unsubscribe(news: Array<string>): void;
    updateSubscriptions(msg: {
        news: Array<string>;
    }): void;
    onNews(fn: (n: AlpacaNews) => void): void;
    dataHandler(data: Array<RawAlpacaNews>): void;
}
