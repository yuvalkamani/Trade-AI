"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlpacaWebsocket = exports.ERROR = exports.CONN_ERROR = exports.EVENT = exports.STATE = void 0;
const events_1 = __importDefault(require("events"));
const ws_1 = __importDefault(require("ws"));
const msgpack5_1 = __importDefault(require("msgpack5"));
// Connection states. Each of these will also emit EVENT.STATE_CHANGE
var STATE;
(function (STATE) {
    STATE["AUTHENTICATING"] = "authenticating";
    STATE["AUTHENTICATED"] = "authenticated";
    STATE["CONNECTED"] = "connected";
    STATE["CONNECTING"] = "connecting";
    STATE["DISCONNECTED"] = "disconnected";
    STATE["WAITING_TO_CONNECT"] = "waiting to connect";
    STATE["WAITING_TO_RECONNECT"] = "waiting to reconnect";
})(STATE = exports.STATE || (exports.STATE = {}));
// Client events
var EVENT;
(function (EVENT) {
    EVENT["CLIENT_ERROR"] = "client_error";
    EVENT["STATE_CHANGE"] = "state_change";
    EVENT["AUTHORIZED"] = "authorized";
    EVENT["UNAUTHORIZED"] = "unauthorized";
    EVENT["TRADES"] = "stock_trades";
    EVENT["QUOTES"] = "stock_quotes";
    EVENT["BARS"] = "stock_bars";
    EVENT["UPDATED_BARS"] = "stock_updated_bars";
    EVENT["DAILY_BARS"] = "stock_daily_bars";
    EVENT["TRADING_STATUSES"] = "trading_statuses";
    EVENT["LULDS"] = "lulds";
    EVENT["CANCEL_ERRORS"] = "cancel_errors";
    EVENT["CORRECTIONS"] = "corrections";
    EVENT["ORDERBOOKS"] = "orderbooks";
    EVENT["NEWS"] = "news";
})(EVENT = exports.EVENT || (exports.EVENT = {}));
// Connection errors by code
exports.CONN_ERROR = new Map([
    [400, "invalid syntax"],
    [401, "not authenticated"],
    [402, "auth failed"],
    [403, "already authenticated"],
    [404, "auth timeout"],
    [405, "symbol limit exceeded"],
    [406, "connection limit exceeded"],
    [407, "slow client"],
    [408, "v2 not enabled"],
    [409, "insufficient subscription"],
    [500, "internal error"],
]);
// Connection errors without code
var ERROR;
(function (ERROR) {
    ERROR["MISSING_SECERT_KEY"] = "missing secret key";
    ERROR["MISSING_API_KEY"] = "missing api key";
    ERROR["UNEXPECTED_MESSAGE"] = "unexpected message";
})(ERROR = exports.ERROR || (exports.ERROR = {}));
class AlpacaWebsocket extends events_1.default.EventEmitter {
    constructor(options) {
        super();
        this.msgpack = (0, msgpack5_1.default)();
        this.session = {
            apiKey: options.apiKey,
            secretKey: options.secretKey,
            subscriptions: options.subscriptions,
            reconnect: true,
            verbose: options.verbose,
            backoff: true,
            reconnectTimeout: 0,
            maxReconnectTimeout: 30,
            backoffIncrement: 0.5,
            url: options.url,
            currentState: STATE.WAITING_TO_CONNECT,
            isReconnected: false,
            pongWait: 5000,
        };
        if (this.session.apiKey.length === 0) {
            throw new Error(ERROR.MISSING_API_KEY);
        }
        if (this.session.secretKey.length === 0) {
            throw new Error(ERROR.MISSING_SECERT_KEY);
        }
        // Register internal event handlers
        // Log and emit every state change
        Object.values(STATE).forEach((s) => {
            this.on(s, () => {
                this.emit(EVENT.STATE_CHANGE, s);
            });
        });
    }
    connect() {
        this.emit(STATE.CONNECTING);
        this.session.currentState = STATE.CONNECTING;
        this.resetSession();
        this.conn = new ws_1.default(this.session.url, {
            perMessageDeflate: {
                serverNoContextTakeover: false,
                clientNoContextTakeover: false,
            },
            headers: {
                "Content-Type": "application/msgpack",
            },
        });
        this.conn.binaryType = "nodebuffer";
        this.conn.once("open", () => this.authenticate());
        this.conn.on("message", (data) => {
            this.handleMessage(this.msgpack.decode(data));
        });
        this.conn.on("error", (err) => {
            this.emit(EVENT.CLIENT_ERROR, err.message);
            this.disconnect();
        });
        this.conn.on("close", (code, msg) => {
            this.log(`connection closed with code: ${code} and message: ${msg}`);
            if (this.session.reconnect) {
                this.reconnect();
            }
        });
        this.conn.on("pong", () => {
            if (this.session.pongTimeout) {
                clearTimeout(this.session.pongTimeout);
            }
        });
        this.session.pingInterval = setInterval(() => {
            this.ping();
        }, 10000);
    }
    onConnect(fn) {
        this.on(STATE.AUTHENTICATED, () => {
            if (this.session.isReconnected) {
                //if reconnected the user should subscribe to its symbols again
                this.subscribeAll();
            }
            else {
                fn();
            }
        });
    }
    reconnect() {
        this.log("Reconnecting...");
        this.session.isReconnected = true;
        const { backoff, backoffIncrement, maxReconnectTimeout } = this.session;
        let reconnectTimeout = this.session.reconnectTimeout;
        if (backoff) {
            setTimeout(() => {
                reconnectTimeout += backoffIncrement;
                if (reconnectTimeout > maxReconnectTimeout) {
                    reconnectTimeout = maxReconnectTimeout;
                }
                this.connect();
            }, reconnectTimeout * 1000);
            this.emit(STATE.WAITING_TO_RECONNECT, reconnectTimeout);
        }
    }
    ping() {
        this.conn.ping();
        this.session.pongTimeout = setTimeout(() => {
            this.log("no pong received from server, terminating...");
            this.conn.terminate();
        }, this.session.pongWait);
    }
    authenticate() {
        const authMsg = {
            action: "auth",
            key: this.session.apiKey,
            secret: this.session.secretKey,
        };
        this.conn.send(this.msgpack.encode(authMsg));
        this.emit(STATE.AUTHENTICATING);
        this.session.currentState = STATE.AUTHENTICATING;
    }
    disconnect() {
        this.emit(STATE.DISCONNECTED);
        this.session.currentState = STATE.DISCONNECTED;
        this.conn.close();
        this.session.reconnect = false;
        if (this.session.pongTimeout) {
            clearTimeout(this.session.pongTimeout);
        }
        if (this.session.pingInterval) {
            clearInterval(this.session.pingInterval);
        }
    }
    onDisconnect(fn) {
        this.on(STATE.DISCONNECTED, () => fn());
    }
    onError(fn) {
        this.on(EVENT.CLIENT_ERROR, (err) => fn(err));
    }
    onStateChange(fn) {
        this.on(EVENT.STATE_CHANGE, (newState) => fn(newState));
    }
    handleMessage(data) {
        const msgType = (data === null || data === void 0 ? void 0 : data.length) ? data[0].T : "";
        switch (msgType) {
            case "success":
                if (data[0].msg === "connected") {
                    this.emit(STATE.CONNECTED);
                    this.session.currentState = STATE.CONNECTED;
                }
                else if (data[0].msg === "authenticated") {
                    this.emit(STATE.AUTHENTICATED);
                    this.session.currentState = STATE.AUTHENTICATED;
                }
                break;
            case "subscription":
                this.updateSubscriptions(data[0]);
                break;
            case "error":
                this.emit(EVENT.CLIENT_ERROR, exports.CONN_ERROR.get(data[0].code));
                break;
            default:
                this.dataHandler(data);
        }
    }
    log(msg) {
        if (this.session.verbose) {
            // eslint-disable-next-line no-console
            console.log(msg);
        }
    }
    getSubscriptions() {
        return this.session.subscriptions;
    }
    resetSession() {
        this.session.reconnect = true;
        this.session.backoff = true;
        this.session.reconnectTimeout = 0;
        this.session.maxReconnectTimeout = 30;
        this.session.backoffIncrement = 0.5;
        if (this.session.pongTimeout) {
            clearTimeout(this.session.pongTimeout);
        }
        if (this.session.pingInterval) {
            clearInterval(this.session.pingInterval);
        }
    }
}
exports.AlpacaWebsocket = AlpacaWebsocket;
