export var __esModule: boolean;
export var STATE: {};
export var EVENT: {};
export var ERROR: {};
/**
 * AlpacaStreamClient manages a connection to Alpaca's websocket api
 */
export class AlpacaStreamClient extends events {
    constructor(opts?: {});
    defaultOptions: {
        subscriptions: never[];
        reconnect: boolean;
        backoff: boolean;
        reconnectTimeout: number;
        maxReconnectTimeout: number;
        backoffIncrement: number;
        verbose: boolean;
        usePolygon: boolean;
    };
    session: {
        subscriptions: never[];
        reconnect: boolean;
        backoff: boolean;
        reconnectTimeout: number;
        maxReconnectTimeout: number;
        backoffIncrement: number;
        verbose: boolean;
        usePolygon: boolean;
    };
    subscriptionState: {};
    currentState: any;
    connect(): void;
    reconnectDisabled: boolean | undefined;
    conn: WebSocket | undefined;
    _ensure_polygon(channels: any): void;
    _unsubscribe_polygon(channels: any): void;
    subscribe(keys: any): void;
    unsubscribe(keys: any): void;
    subscriptions(): string[];
    onConnect(fn: any): void;
    onDisconnect(fn: any): void;
    onStateChange(fn: any): void;
    onError(fn: any): void;
    onOrderUpdate(fn: any): void;
    onAccountUpdate(fn: any): void;
    onPolygonConnect(fn: any): void;
    onPolygonDisconnect(fn: any): void;
    onStockTrades(fn: any): void;
    onStockQuotes(fn: any): void;
    onStockAggSec(fn: any): void;
    onStockAggMin(fn: any): void;
    send(data: any): void;
    disconnect(): void;
    state(): any;
    get(key: any): any;
    reconnect(): void;
    authenticate(): void;
    handleMessage(data: any): void;
    authResultHandler(authResult: any): void;
    log(level: any, ...msg: any[]): void;
}
import events = require("events");
import WebSocket = require("ws");
