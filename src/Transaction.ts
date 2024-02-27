export interface Transaction {
    id?: string;
    type?: string;
    counterpartyCompId?: string;
    counterpartyExecId?: string;
    orderId?: string;
    accountNumber?: string;
    contraAccountNumber?: string;
    securityId?: string;
    status?: string;
    qty?: number;
    price?: number;
    cashImpact?: number;
    fee?: number;
    effectiveDate?: string;
    settleDate?: string;
    createdAt?: string;
    memo?: string;
}