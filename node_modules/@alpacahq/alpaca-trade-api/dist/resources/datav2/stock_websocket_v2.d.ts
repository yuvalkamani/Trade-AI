import { AlpacaTrade, AlpacaQuote, AlpacaBar, AlpacaStatus, AlpacaLuld, AlpacaCancelError, AlpacaCorrection, RawTrade, RawQuote, RawBar, RawLuld, RawStatus, RawCancelError, RawCorrection } from "./entityv2";
import { AlpacaWebsocket as Websocket, WebsocketOptions } from "./websocket";
interface StockWebsocketOptions extends WebsocketOptions {
    feed?: string;
}
export declare class AlpacaStocksClient extends Websocket {
    constructor(options: StockWebsocketOptions);
    subscribeForTrades(trades: Array<string>): void;
    subscribeForQuotes(quotes: Array<string>): void;
    subscribeForBars(bars: Array<string>): void;
    subscribeForUpdatedBars(updatedBars: Array<string>): void;
    subscribeForDailyBars(dailyBars: Array<string>): void;
    subscribeForStatuses(statuses: Array<string>): void;
    subscribeForLulds(lulds: Array<string>): void;
    subscribe(symbols: {
        trades?: Array<string>;
        quotes?: Array<string>;
        bars?: Array<string>;
        updatedBars?: Array<string>;
        dailyBars?: Array<string>;
        statuses?: Array<string>;
        lulds?: Array<string>;
    }): void;
    subscribeAll(): void;
    unsubscribeFromTrades(trades: Array<string>): void;
    unsubscribeFromQuotes(quotes: Array<string>): void;
    unsubscribeFromBars(bars: Array<string>): void;
    unsubscribeFromUpdatedBars(updatedBars: Array<string>): void;
    unsubscribeFromDailyBars(dailyBars: Array<string>): void;
    unsubscribeFromStatuses(statuses: Array<string>): void;
    unsubscribeFromLulds(lulds: Array<string>): void;
    unsubscribe(symbols: {
        trades?: Array<string>;
        quotes?: Array<string>;
        bars?: Array<string>;
        updatedBars?: Array<string>;
        dailyBars?: Array<string>;
        statuses?: Array<string>;
        lulds?: Array<string>;
    }): void;
    updateSubscriptions(msg: {
        trades: Array<string>;
        quotes: Array<string>;
        bars: Array<string>;
        updatedBars: Array<string>;
        dailyBars: Array<string>;
        statuses: Array<string>;
        lulds: Array<string>;
        cancelErrors: Array<string>;
        corrections: Array<string>;
    }): void;
    onStockTrade(fn: (tarde: AlpacaTrade) => void): void;
    onStockQuote(fn: (quote: AlpacaQuote) => void): void;
    onStockBar(fn: (bar: AlpacaBar) => void): void;
    onStockUpdatedBar(fn: (updatedBar: AlpacaBar) => void): void;
    onStockDailyBar(fn: (dailyBar: AlpacaBar) => void): void;
    onStatuses(fn: (status: AlpacaStatus) => void): void;
    onLulds(fn: (luld: AlpacaLuld) => void): void;
    onCancelErrors(fn: (cancelError: AlpacaCancelError) => void): void;
    onCorrections(fn: (correction: AlpacaCorrection) => void): void;
    dataHandler(data: Array<RawTrade | RawQuote | RawBar | RawStatus | RawLuld | RawCancelError | RawCorrection>): void;
}
export {};
