import React, {useState} from "react";
import axios from "axios";
import SlidingPane from "react-sliding-pane";
import {Order} from "./Order.tsx";

interface OrderEntrySliderProps {
    isOpen: boolean;
    onRequestClose: () => void;
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
                    <button className="text-blue-700 border rounded px-2 py-1.5 border-blue-700 mt-4"
                            disabled={submitting} onClick={submitOrder}>
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