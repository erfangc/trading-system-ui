import SlidingPane from "react-sliding-pane";
import React, {ChangeEvent} from "react";
import {Account} from "./Account.tsx";

interface Props {
    isOpen: boolean;
    formData: Account;
    idx: number;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onRequestClose: () => void;
}

/**
 * A pane component for editing a specific joint owner within a list of joint owners.
 *
 * @param {Object} props - Properties for the joint owner editor.
 * @param {boolean} props.isOpen - Controls the visibility of the sliding pane.
 * @param {Account} props.formData - The overall account data containing the jointOwners array.
 * @param {number} props.idx - Index of the joint owner being edited within the jointOwners array.
 * @param {(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void} props.onChange -  Event handler for form field changes within the pane.
 * @param {() => void} props.onRequestClose - Callback function to trigger the closure of the sliding pane.
 */
export function JointOwnerEditorPane({isOpen, formData, idx, onChange, onRequestClose}: Props) {
    const data = formData.jointOwners?.[idx];
    return (
        <SlidingPane
            className="some-custom-class"
            overlayClassName="some-custom-overlay-class"
            isOpen={isOpen}
            title="Joint Owner Form"
            subtitle="Tell us about this joint owner."
            onRequestClose={onRequestClose}
        >
            <fieldset className="space-y-4">
                <fieldset className="space-y-1">
                    <legend className="font-bold">Primary Owner</legend>
                    <div>
                        <label className="mr-2" htmlFor="firstName">First Name:</label>
                        <input
                            className="border px-4 py-1 ml-1"
                            type="text"
                            id="firstName"
                            onChange={onChange}
                            value={data?.firstName}
                            name={`jointOwners[${idx}].firstName`}
                            required
                        />
                    </div>
                    <div>
                        <label className="mr-2" htmlFor="lastName">Last Name:</label>
                        <input
                            className="border px-4 py-1 ml-1"
                            type="text"
                            id="lastName"
                            value={data?.lastName}
                            onChange={onChange}
                            name={`jointOwners[${idx}].lastName`}
                            required
                        />
                    </div>
                    <div>
                        <label className="mr-2" htmlFor="birthDate">Birth Date:</label>
                        <input
                            type="date"
                            className="border px-4 py-1 ml-1"
                            id="birthDate"
                            value={data?.birthDate}
                            onChange={onChange}
                            name={`jointOwners[${idx}].birthDate`}
                            required
                        />
                    </div>
                </fieldset>
                <fieldset className="space-y-1">
                    <legend className="font-bold">Mailing Address</legend>
                    <div>
                        <label className="mr-2" htmlFor="address1">Address Line 1:</label>
                        <input
                            className="border px-4 py-1 ml-1 w-64"
                            value={data?.mailingAddress?.line1}
                            type="text"
                            id="address1"
                            onChange={onChange}
                            name={`jointOwners[${idx}].mailingAddress.line1`}
                            required
                        />
                    </div>
                    <div>
                        <label className="mr-2" htmlFor="address2">Address Line 2:</label>
                        <input
                            className="border px-4 py-1 ml-1"
                            type="text"
                            id="address2"
                            value={data?.mailingAddress?.line2}
                            name={`jointOwners[${idx}].mailingAddress.line2`}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label className="mr-2" htmlFor="city">City:</label>
                        <input
                            className="border px-4 py-1 ml-1"
                            type="text"
                            id="city"
                            name={`jointOwners[${idx}].mailingAddress.city`}
                            value={data?.mailingAddress?.city}
                            required
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label className="mr-2" htmlFor="state">State:</label>
                        <input
                            className="border px-4 py-1 ml-1"
                            type="text"
                            id="state"
                            name={`jointOwners[${idx}].mailingAddress.state`}
                            value={data?.mailingAddress?.state}
                            required
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <label className="mr-2" htmlFor="zip">Zip Code:</label>
                        <input
                            className="border px-4 py-1 ml-1"
                            type="text"
                            id="zip"
                            name={`jointOwners[${idx}].mailingAddress.zip`}
                            value={data?.mailingAddress?.zip}
                            required
                            onChange={onChange}
                        />
                    </div>
                </fieldset>
                <div>
                    <label className="mr-2" htmlFor="taxId">Tax ID:</label>
                    <input
                        className="border px-4 py-1 ml-1"
                        type="text"
                        id="taxId"
                        name={`jointOwners[${idx}].taxId`}
                        value={data?.taxId}
                        required
                        onChange={onChange}
                    />
                </div>
            </fieldset>
        </SlidingPane>
    );
}