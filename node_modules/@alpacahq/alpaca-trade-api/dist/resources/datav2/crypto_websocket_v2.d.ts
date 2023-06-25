import { CryptoBar, CryptoQuote, CryptoTrade, CryptoOrderbook, RawCryptoTrade, RawCryptoQuote, RawCryptoBar, RawCryptoOrderbook } from "./entityv2";
import { AlpacaWebsocket as Websocket, WebsocketOptions } from "./websocket";
interface CrypotoWebsocketOptions extends WebsocketOptions {
    exchanges?: string | Array<string>;
}
export declare class AlpacaCryptoClient extends Websocket {
    constructor(options: CrypotoWebsocketOptions);
    subscribeForTrades(trades: Array<string>): void;
    subscribeForQuotes(quotes: Array<string>): void;
    subscribeForBars(bars: Array<string>): void;
    subscribeForUpdatedBars(updatedBars: Array<string>): void;
    subscribeForDailyBars(dailyBars: Array<string>): void;
    subscribeForOrderbooks(orderbooks: Array<string>): void;
    subscribe(symbols: {
        trades?: Array<string>;
        quotes?: Array<string>;
        bars?: Array<string>;
        updatedBars?: Array<string>;
        dailyBars?: Array<string>;
        orderbooks?: Array<string>;
    }): void;
    subscribeAll(): void;
    unsubscribeFromTrades(trades: Array<string>): void;
    unsubscribeFromQuotes(quotes: Array<string>): void;
    unsubscribeFromBars(bars: Array<string>): void;
    unsubscribeFromUpdatedBars(updatedBars: Array<string>): void;
    unsubscriceFromDailyBars(dailyBars: Array<string>): void;
    unsubscribeFromOrderbooks(orderbooks: Array<string>): void;
    unsubscribe(symbols: {
        trades?: Array<string>;
        quotes?: Array<string>;
        bars?: Array<string>;
        updatedBars?: Array<string>;
        dailyBars?: Array<string>;
        orderbooks?: Array<string>;
    }): void;
    updateSubscriptions(msg: {
        trades: Array<string>;
        quotes: Array<string>;
        bars: Array<string>;
        updatedBars: Array<string>;
        dailyBars: Array<string>;
        orderbooks: Array<string>;
    }): void;
    onCryptoTrade(fn: (trade: CryptoTrade) => void): void;
    onCryptoQuote(fn: (quote: CryptoQuote) => void): void;
    onCryptoBar(fn: (bar: CryptoBar) => void): void;
    onCryptoUpdatedBar(fn: (updatedBar: CryptoBar) => void): void;
    onCryptoDailyBar(fn: (dailyBar: CryptoBar) => void): void;
    onCryptoOrderbook(fn: (orderbook: CryptoOrderbook) => void): void;
    dataHandler(data: Array<RawCryptoTrade | RawCryptoQuote | RawCryptoBar | RawCryptoOrderbook>): void;
}
export {};
