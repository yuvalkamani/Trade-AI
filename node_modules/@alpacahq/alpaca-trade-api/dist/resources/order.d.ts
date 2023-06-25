export function getAll({ status, until, after, limit, direction, nested, symbols }?: {
    status: any;
    until: any;
    after: any;
    limit: any;
    direction: any;
    nested: any;
    symbols: any;
}): any;
export function getOne(id: any): any;
export function getByClientOrderId(clientOrderId: any): any;
export function post(order: any): any;
export function patchOrder(id: any, newOrder: any): any;
export function cancel(id: any): any;
export function cancelAll(): any;
