declare class AlpacaCORS {
    constructor(config: any);
    keyId: any;
    secretKey: any;
    baseUrl: any;
    httpRequest(method: any, args: any, body?: undefined): Promise<Response>;
    dataHttpRequest(method: any, args: any, body?: undefined): Promise<Response>;
    argsFormatter(type: any, path: any, query: any): any;
    getAccount(): Promise<any>;
    createOrder(body: any): Promise<any>;
    getOrders(query?: undefined): Promise<any>;
    getOrder(path: any): Promise<any>;
    getOrderByClientId(query: any): Promise<any>;
    cancelOrder(path: any): Promise<any>;
    getPosition(path: any): Promise<any>;
    getPositions(): Promise<any>;
    getAssets(query?: undefined): Promise<any>;
    getAsset(path: any): Promise<any>;
    getCalendar(query?: undefined): Promise<any>;
    getClock(): Promise<any>;
    getBars(path: any, query1: any, query2?: undefined): Promise<any>;
}
