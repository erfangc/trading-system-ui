import React, {useState} from "react";
import "react-sliding-pane/dist/react-sliding-pane.css";
import {Account} from "./Account.tsx";
import {modifyNestedPropertyByPath} from "./helper_functions.ts";
import {JointOwnerEditorPane} from "./JointOwnerEditorPane.tsx";
import axios from "axios";

export function NewAccount() {

    const [formData, setFormData] = useState<Account>({accountType: 'I'});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showJointOwnerPane, setShowJointOwnerPane] = useState(false);
    const [currentJointOwnerIdx, setCurrentJointOwnerIdx] = useState(0);

    function newJointOwner() {
        setShowJointOwnerPane(true);
        setCurrentJointOwnerIdx(formData.jointOwners.length);
    }

    function removeJointOwner(idx: number) {
        setCurrentJointOwnerIdx(0);
        setFormData({...formData, jointOwners: formData.jointOwners.filter((_, i) => i !== idx)});
    }

    function editJointOwner(idx: number) {
        setShowJointOwnerPane(true);
        setCurrentJointOwnerIdx(idx);
    }

    function dismissJointOwnerPane() {
        setShowJointOwnerPane(false);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        const updatedValue = modifyNestedPropertyByPath(formData, name, value);
        setFormData({...updatedValue});
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const {data} = await axios.post('http://localhost:8080/api/v1/accounts', formData);
            setSuccess(true);
            setFormData(data);
        } catch (error) {
            setSubmitError('Error creating account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        !success ?
            <form onSubmit={handleSubmit} className="mx-4">
                <fieldset className="space-y-8">
                    <legend>Account Opening Form</legend>
                    <div>
                        <label className="mr-2" htmlFor="accountType">Account Type:</label>
                        <select id="accountType" name="accountType">
                            <option value="I">Individual</option>
                        </select>
                    </div>

                    <fieldset className="space-y-4">
                        <fieldset className="space-y-1">
                            <legend className="font-bold">Primary Owner</legend>
                            <div>
                                <label className="mr-2" htmlFor="primaryFirstName">First Name:</label>
                                <input
                                    className="border px-4 py-1 ml-1"
                                    type="text"
                                    id="firstName"
                                    onChange={handleChange}
                                    name="primaryOwner.firstName"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mr-2" htmlFor="primaryLastName">Last Name:</label>
                                <input
                                    className="border px-4 py-1 ml-1"
                                    type="text"
                                    id="lastName"
                                    onChange={handleChange}
                                    name="primaryOwner.lastName"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mr-2" htmlFor="primaryBirthDate">Birth Date:</label>
                                <input
                                    type="date"
                                    className="border px-4 py-1 ml-1"
                                    id="birthDate"
                                    onChange={handleChange}
                                    name="primaryOwner.birthDate"
                                    required
                                />
                            </div>
                        </fieldset>

                        <fieldset className="space-y-1">
                            <legend className="font-bold">Joint Owners</legend>
                            {formData?.jointOwners?.length === 0 &&
                                <p className="text-sm text-stone-600">There are no joint owners on this account</p>}
                            <div className="space-y-1 py-2">
                                {
                                    formData?.jointOwners?.map((jointOwner, idx) => (
                                        <div key={idx} className="flex space-x-2">
                                            {
                                                jointOwner.firstName && jointOwner
                                                    ? <p>{jointOwner.firstName} {jointOwner.lastName}</p>
                                                    : <p>No Name entered</p>
                                            }
                                            <button className="text-blue-600 text-sm"
                                                    onClick={() => editJointOwner(idx)}>
                                                Edit
                                            </button>
                                            <button className="text-red-600 text-sm"
                                                    onClick={() => removeJointOwner(idx)}>
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                            <button className="px-2 text-sm py-0.5 text-blue-600 border border-blue-600 rounded"
                                    onClick={newJointOwner}>
                                + Joint Owner
                            </button>
                            <JointOwnerEditorPane
                                formData={formData}
                                onRequestClose={dismissJointOwnerPane}
                                onChange={handleChange}
                                idx={currentJointOwnerIdx}
                                isOpen={showJointOwnerPane}
                            />
                        </fieldset>

                        <fieldset className="space-y-1">
                            <legend className="font-bold">Mailing Address</legend>
                            <div>
                                <label className="mr-2" htmlFor="primaryAddress1">Address Line 1:</label>
                                <input
                                    className="border px-4 py-1 ml-1 w-64"
                                    type="text" id="address1"
                                    onChange={handleChange}
                                    name="primaryOwner.mailingAddress.line1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mr-2" htmlFor="primaryAddress2">Address Line 2:</label>
                                <input
                                    className="border px-4 py-1 ml-1"
                                    type="text"
                                    id="address2"
                                    name="primaryOwner.mailingAddress.line2"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="mr-2" htmlFor="primaryCity">City:</label>
                                <input
                                    className="border px-4 py-1 ml-1"
                                    type="text"
                                    id="city"
                                    name="primaryOwner.mailingAddress.city"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="mr-2" htmlFor="primaryState">State:</label>
                                <input
                                    className="border px-4 py-1 ml-1"
                                    type="text"
                                    id="state"
                                    name="primaryOwner.mailingAddress.state"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="mr-2" htmlFor="primaryZip">Zip Code:</label>
                                <input
                                    className="border px-4 py-1 ml-1"
                                    type="text"
                                    id="zip"
                                    name="primaryOwner.mailingAddress.zip"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </fieldset>

                        <div>
                            <label className="mr-2" htmlFor="primaryTaxId">Tax ID:</label>
                            <input
                                className="border px-4 py-1 ml-1"
                                type="text"
                                id="taxId"
                                name="primaryOwner.taxId"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </fieldset>

                    <button type="submit" className="bg-stone-900 text-white p-4 rounded" disabled={isSubmitting}>
                        Open Account
                    </button>
                </fieldset>
            </form>
            : 
            <div className="mx-4 space-y-4">
                <h1 className="text-2xl text-emerald-800">Your new account has been successfully created:</h1>
                <div>
                    <div className="space-x-2"><span className="font-bold">Account Number:</span><span>{formData?.accountNumber}</span></div>
                    <div className="space-x-2"><span className="font-bold">Account Type:</span><span>Individual Account</span></div>
                    <div className="space-x-2"><span className="font-bold">Primary Owner:</span><span>{formData?.primaryOwner?.firstName} {formData?.primaryOwner?.lastName}</span></div>
                    <div className="space-x-2"><span className="font-bold">Primary Owner Tax ID:</span><span>{formData?.primaryOwner?.taxId}</span></div>
                    {formData?.jointOwners?.length > 0 ?
                        <div className="space-x-2"><span className="font-bold">Joint Owner:</span><span>{formData?.jointOwners[0]?.firstName} {formData?.jointOwners[0]?.lastName}</span></div> : null
                    }
                </div>
            </div>

    );
}