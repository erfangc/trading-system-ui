export interface Order {
    id?: string;
    accountNumber?: string;
    securityId?: string;
    type?: string;
    timeInForce?: string;
    limitPrice?: number;
    qty?: number;
    timestamp?: string;
    date?: string;
    status?: string;
}