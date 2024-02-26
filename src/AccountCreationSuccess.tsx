import {Account} from "./Account.tsx";
import React from "react";

export function AccountCreationSuccess(props: { formData: Account }) {
    return <div className="mx-4 space-y-4">
        <h1 className="text-2xl text-emerald-800">Your new account has been successfully created:</h1>
        <div>
            <div className="space-x-2"><span
                className="font-bold">Account Number:</span><span>{props.formData?.accountNumber}</span></div>
            <div className="space-x-2"><span
                className="font-bold">Account Type:</span><span>Individual Account</span></div>
            <div className="space-x-2"><span
                className="font-bold">Primary Owner:</span><span>{props.formData?.primaryOwner?.firstName} {props.formData?.primaryOwner?.lastName}</span>
            </div>
            <div className="space-x-2"><span
                className="font-bold">Primary Owner Tax ID:</span><span>{props.formData?.primaryOwner?.taxId}</span>
            </div>
            {props.formData?.jointOwners?.length > 0 ?
                <div className="space-x-2"><span
                    className="font-bold">Joint Owner:</span><span>{props.formData?.jointOwners[0]?.firstName} {props.formData?.jointOwners[0]?.lastName}</span>
                </div> : null
            }
        </div>
    </div>;
}