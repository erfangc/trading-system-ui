import {Person} from "./Person.tsx";

export interface Account {
    accountNumber?: string;
    accountType?: string;
    primaryOwner?: Person;
    jointOwners?: Person[];
}