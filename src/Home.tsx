import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {Account} from "./Account.tsx";
import axios from "axios";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

function toName(input: string) {
    if (input === 'I') {
        return "Individual Account";
    } else {
        return "Unknown Account Type";
    }
}

export function Home() {
    
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/v1/accounts`)
            .then(resp => setAccounts(resp.data))
            .finally(() => setLoading(false));
    }, []);
    
    return (
        <div className="mx-4">
            {
                accounts.length !== 0 &&
                <table className="table-auto w-full min-w-max border-collapse border-slate-400">
                    <thead>
                    <tr className="bg-slate-100 text-slate-700">
                        <th className="py-3 px-4 text-left">Account Number</th>
                        <th className="py-3 px-4 text-left">Account Type</th>
                        <th className="py-3 px-4 text-left">Primary Owner</th>
                        <th className="py-3 px-4 text-left"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {accounts?.map(account => (
                        <tr key={account.accountNumber}>
                            <td className="py-3 px-4 border border-slate-300">{account.accountNumber}</td>
                            <td className="py-3 px-4 border border-slate-300">{toName(account.accountType)}</td>
                            <td className="py-3 px-4 border border-slate-300">{account.primaryOwner.firstName} {account.primaryOwner.lastName}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            }
            {
                accounts.length === 0 && loading === false
                ? <p>There are no accounts currently open</p>
                : null
            }
            <br/>
            <button>
                <Link to="/new-account" className="bg-stone-950 text-white p-4 rounded">Open an Account</Link>
            </button>
        </div>
    );
}