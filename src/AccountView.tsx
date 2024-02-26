import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Account} from "./Account.tsx";
import axios from "axios";
import {toAccountTypeFullDescription} from "./helper_functions.ts";

export function AccountView() {
    
    const {accountNumber} = useParams();
    const [account, setAccount] = useState<Account>();
    const [positions, setPositions] = useState<Position[]>([]);
    
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