/// <reference types="node" />
import events from "events";
import WebSocket from "ws";
import { MessagePack } from "msgpack5";
export declare enum STATE {
    AUTHENTICATING = "authenticating",
    AUTHENTICATED = "authenticated",
    CONNECTED = "connected",
    CONNECTING = "connecting",
    DISCONNECTED = "disconnected",
    WAITING_TO_CONNECT = "waiting to connect",
    WAITING_TO_RECONNECT = "waiting to reconnect"
}
export declare enum EVENT {
    CLIENT_ERROR = "client_error",
    STATE_CHANGE = "state_change",
    AUTHORIZED = "authorized",
    UNAUTHORIZED = "unauthorized",
    TRADES = "stock_trades",
    QUOTES = "stock_quotes",
    BARS = "stock_bars",
    UPDATED_BARS = "stock_updated_bars",
    DAILY_BARS = "stock_daily_bars",
    TRADING_STATUSES = "trading_statuses",
    LULDS = "lulds",
    CANCEL_ERRORS = "cancel_errors",
    CORRECTIONS = "corrections",
    ORDERBOOKS = "orderbooks",
    NEWS = "news"
}
export declare const CONN_ERROR: Map<number, string>;
export declare enum ERROR {
    MISSING_SECERT_KEY = "missing secret key",
    MISSING_API_KEY = "missing api key",
    UNEXPECTED_MESSAGE = "unexpected message"
}
interface WebsocketSession {
    apiKey: string;
    secretKey: string;
    subscriptions: any;
    reconnect: boolean;
    verbose: boolean;
    backoff: boolean;
    reconnectTimeout: number;
    maxReconnectTimeout: number;
    backoffIncrement: number;
    url: string;
    currentState: STATE;
    pongTimeout?: NodeJS.Timeout;
    pingInterval?: NodeJS.Timer;
    pongWait: number;
    isReconnected: boolean;
}
interface AlpacaBaseWebsocket {
    session: WebsocketSession;
    connect: () => void;
    onConnect: (fn: () => void) => void;
    reconnect: () => void;
    onError: (fn: (err: Error) => void) => void;
    onStateChange: (fn: () => void) => void;
    authenticate: () => void;
    handleMessage(data: any): void;
    disconnect: () => void;
    onDisconnect: (fn: () => void) => void;
    getSubscriptions: () => void;
    log: (msg: Array<any>) => void;
}
export interface WebsocketOptions {
    apiKey: string;
    secretKey: string;
    url: string;
    verbose: boolean;
    subscriptions?: any;
}
export declare abstract class AlpacaWebsocket extends events.EventEmitter implements AlpacaBaseWebsocket {
    session: WebsocketSession;
    msgpack: MessagePack;
    conn: WebSocket;
    constructor(options: WebsocketOptions);
    connect(): void;
    onConnect(fn: () => void): void;
    reconnect(): void;
    ping(): void;
    authenticate(): void;
    disconnect(): void;
    onDisconnect(fn: () => void): void;
    onError(fn: (err: Error) => void): void;
    onStateChange(fn: (newState: STATE) => void): void;
    handleMessage(data: any): void;
    log(msg: unknown): void;
    getSubscriptions(): void;
    resetSession(): void;
    abstract dataHandler(data: unknown): void;
    abstract updateSubscriptions(data: unknown): void;
    abstract subscribeAll(): void;
}
export {};
