import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Account} from "./Account.tsx";
import axios from "axios";
import {toAccountTypeFullDescription} from "./helper_functions.ts";
import SlidingPane from "react-sliding-pane";

export function AccountView() {

    const {accountNumber} = useParams();
    const [account, setAccount] = useState<Account>();
    const [positions, setPositions] = useState<Position[]>([]);
    const [orderEntryVisible, setOrderEntryVisible] = useState(false);

    function showOrderEntry() {
        setOrderEntryVisible(true);
    }

    function closeOrderEntry() {
        setOrderEntryVisible(false);
    }

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
            <div>
                {toAccountTypeFullDescription(account?.accountType)} | Account Number: {account?.accountNumber}
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
            <div className="space-y-2">
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
                    </tr>
                    </thead>
                    <tbody>
                    {positions.map(position => (
                        <tr key={position.securityId}>
                            <td className="py-3 px-4 border border-slate-300">{position.securityId}</td>
                            <td className="py-3 px-4 border border-slate-300">{position.qty.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

interface OrderEntrySliderProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

interface Order {
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

export function OrderEntrySlider(
    {isOpen, onRequestClose}: OrderEntrySliderProps
) {
    const [securityId, setSecurityId] = useState<string>('');
    const [qty, setQty] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [order, setOrder] = useState<Order>();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    async function submitOrder() {
        setSubmitting(true);
        if (isNaN(parseFloat(qty)) || !securityId || !accountNumber) {
            return;
        }
        try {
            const {data} = await axios
                .post(`http://localhost:8080/api/v1/orders?&qty=${qty}&accountNumber=${accountNumber}&securityId=${securityId}`);
            setOrder(data);
            setSuccess(true);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <SlidingPane
            isOpen={isOpen}
            title="Order Entry"
            subtitle="Place a trade"
            onRequestClose={onRequestClose}
        >
            {!success
                && <div>
                    <fieldset className="w-96 space-y-2">
                        <div className="flex justify-between">
                            <label className="font-bold" htmlFor="securityId">Security ID</label>
                            <input 
                                className="border px-4 py-1 ml-1" 
                                type="text" 
                                value={securityId}
                                onChange={evt => setSecurityId(evt.target.value)}
                                name="securityId"
                                placeholder="Security ID"
                            />
                        </div>
                        <div className="flex justify-between">
                            <label className="font-bold" htmlFor="accountNumber">Account Number</label>
                            <input 
                                className="border px-4 py-1 ml-1"
                                type="text"
                                name="accountNumber"
                                placeholder="Account Number"
                                value={accountNumber}
                                onChange={evt => setAccountNumber(evt.target.value)}
                            />
                        </div>
                        <div className="flex justify-between">
                            <label className="font-bold" htmlFor="qty">Quantity</label>
                            <input
                                className="border px-4 py-1 ml-1"
                                type="text" 
                                name="qty"
                                placeholder="Quantity"
                                value={qty}
                                onChange={evt => setQty(evt.target.value)}
                            />
                        </div>
                    </fieldset>
                    <button className="text-blue-700 border rounded px-2 py-1.5 border-blue-700 mt-4" disabled={submitting} onClick={submitOrder}>
                        Submit Order
                    </button>
                </div>
            }
            {success && (
                <div className="mx-4 space-y-4">
                    <h1 className="text-2xl text-emerald-800">Order has been successfully placed:</h1>
                    <div>
                        <div className="space-x-2"><span
                            className="font-bold">Account Number:</span><span>{order?.accountNumber}</span>
                        </div>
                        <div className="space-x-2">
                            <span className="font-bold">Order ID:</span><span>{order?.id}</span>
                        </div>
                        <div className="space-x-2"><span
                            className="font-bold">Status:</span>{order?.status}<span></span>
                        </div>
                        <div className="space-x-2"><span
                            className="font-bold">Security ID:</span><span>{order?.securityId}</span>
                        </div>
                        <div className="space-x-2"><span
                            className="font-bold">Quantity:</span><span>{order?.qty}</span>
                        </div>
                    </div>
                </div>
            )}
        </SlidingPane>
    );
}