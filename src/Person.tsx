export interface Person {
    birthDate?: string;
    firstName?: string;
    lastName?: string;
    loginId?: string;
    mailingAddress?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        zip?: string;
    };
    taxId?: string;
}