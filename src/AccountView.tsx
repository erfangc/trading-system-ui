import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Account} from "./Account.tsx";
import axios from "axios";
import {toAccountTypeFullDescription} from "./helper_functions.ts";
import {OrderEntrySlider} from "./OrderEntrySlider.tsx";
import {Order} from "./Order.tsx";
import {Transaction} from "./Transaction.ts";

export function AccountView() {

    const {accountNumber} = useParams();
    const [account, setAccount] = useState<Account>();
    const [positions, setPositions] = useState<Position[]>([]);
    const [orderEntryVisible, setOrderEntryVisible] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    function showOrderEntry() {
        setOrderEntryVisible(true);
    }

    function closeOrderEntry() {
        setOrderEntryVisible(false);
        window.location.reload();
    }

    useEffect(() => {
        if (accountNumber) {
            axios
                .get(`http://localhost:8080/api/v1/orders?accountNumber=${accountNumber}`)
                .then(resp => setOrders(resp.data));
        }
    }, [accountNumber]);

    useEffect(() => {
        if (accountNumber) {
            axios
                .get(`http://localhost:8080/api/v1/accounts/${accountNumber}/transactions`)
                .then(resp => setTransactions(resp.data));
        }
    }, [accountNumber]);
    
    useEffect(() => {
        if (accountNumber) {
            axios
                .get(`http://localhost:8080/api/v1/accounts/${accountNumber}`)
                .then(resp => setAccount(resp.data));
            axios
                .get(`http://localhost:8080/api/v1/accounts/${accountNumber}/positions`)
                .then(resp => setPositions(resp.data));
        }
    }, [accountNumber]);

    return (
        <main className="mx-4 space-y-8">

            <div className="fixed right-0 bg-gray-100 px-4 py-8 shadow-md rounded w-48">
                <h1 className="font-bold mb-4">Navigate To</h1>
                <ul className="text-blue-700 text-sm space-y-1">
                    <li><a href="#summary">Summary</a></li>
                    <li><a href="#positions">Positions</a></li>
                    <li><a href="#orders">Orders</a></li>
                    <li><a href="#transactions">Transactions</a></li>
                </ul>
            </div>
            <div id="summary">
                <b className="font-bold text-2xl">Account Summary</b>
                <p>
                    {toAccountTypeFullDescription(account?.accountType)} | Account Number: {account?.accountNumber}
                </p>
            </div>
            <div className="space-y-2">
                <b className="font-bold">Primary Owner Information</b>
                <p className="space-x-2">
                    <span className="font-bold">Name:</span>
                    <span>{account?.primaryOwner?.lastName}, {account?.primaryOwner?.firstName}</span>
                </p>
                <p className="text-sm">
                    <span>Address:</span>
                    <br/>
                    {account?.primaryOwner?.mailingAddress?.line1}
                    <br/>
                    {account?.primaryOwner?.mailingAddress?.line2 || null}
                    <br/>
                    <span>{account?.primaryOwner?.mailingAddress?.city} {account?.primaryOwner?.mailingAddress?.state}, {account?.primaryOwner?.mailingAddress?.zip}</span>
                </p>
            </div>
            <div className="space-y-2" id="positions">
                <b className="font-bold text-2xl">Positions</b>
                <hr/>
                <button
                    className="text-blue-700 border rounded px-2 py-1.5 border-blue-700"
                    onClick={showOrderEntry}
                >
                    Place Order
                </button>
                <OrderEntrySlider isOpen={orderEntryVisible} onRequestClose={closeOrderEntry}/>
                <table className="table-auto w-full min-w-max border-collapse border-slate-400">
                    <thead>
                    <tr className="bg-slate-100 text-slate-700">
                        <th className="py-3 px-4 text-left">Security ID</th>
                        <th className="py-3 px-4 text-left">Quantity</th>
                        <th className="py-3 px-4 text-left">Market Value</th>
                        <th className="py-3 px-4 text-left">Close Price</th>
                        <th className="py-3 px-4 text-right">Daily Price Change</th>
                        <th className="py-3 px-4 text-right">Daily Price Change %</th>
                    </tr>
                    </thead>
                    <tbody>
                    {positions.map(position => {
                        const dailyChange = position.dailyChange;
                        const isNegative = dailyChange < 0;
                        return (
                            <tr key={position.securityId}>
                                <td className="py-3 px-4 border border-slate-300">{position.securityId}</td>
                                <td className="py-3 px-4 border border-slate-300">{position.qty.toFixed(2)}</td>
                                <td className="py-3 px-4 border border-slate-300">${position.marketValue?.toFixed(2)}</td>
                                <td className="py-3 px-4 border border-slate-300">${position.closePrice?.toFixed(2)}</td>
                                <td className={`py-3 px-4 border text-right border-slate-300 ${isNegative ? 'text-red-600' : 'text-green-500'}`}>{dailyChange?.toFixed(2)}</td>
                                <td className={`py-3 px-4 border text-right border-slate-300 ${isNegative ? 'text-red-600' : 'text-green-500'}`}>{(position.dailyChangePercent)?.toFixed(2)}%</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <div className="space-y-2" id="orders">
                <b className="font-bold text-2xl">Orders</b>
                <hr/>
                <table className="table-auto w-full min-w-max border-collapse border-slate-400">
                    <thead>
                    <tr className="bg-slate-100 text-slate-700">
                        <th className="py-3 px-4 text-left">Security ID</th>
                        <th className="py-3 px-4 text-left">Quantity</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders?.map(order => {
                        return (
                            <tr key={order.id}>
                                <td className="py-3 px-4 border border-slate-300">{order.securityId}</td>
                                <td className="py-3 px-4 border border-slate-300">{order.qty}</td>
                                <td className="py-3 px-4 border border-slate-300">{order.status}</td>
                                <td className="py-3 px-4 border border-slate-300">{new Date(order.timestamp).toLocaleString()}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <br/>
            </div>
            <div className="space-y-2" id="transactions">
                <b className="font-bold text-2xl">Transactions</b>
                <hr/>
                <table className="table-auto w-full min-w-max border-collapse border-slate-400">
                    <thead>
                    <tr className="bg-slate-100 text-slate-700">
                        <th className="py-3 px-4 text-left">Security ID</th>
                        <th className="py-3 px-4 text-left">Quantity</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions?.map(transaction => {
                        return (
                            <tr key={transaction.id}>
                                <td className="py-3 px-4 border border-slate-300">{transaction.securityId}</td>
                                <td className="py-3 px-4 border border-slate-300">{transaction.qty}</td>
                                <td className="py-3 px-4 border border-slate-300">{transaction.status}</td>
                                <td className="py-3 px-4 border border-slate-300">{new Date(transaction.createdAt).toLocaleString()}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <br/>
            </div>
        </main>
    );
}

