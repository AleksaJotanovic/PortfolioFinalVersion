export class AccountlessCustomer {
    firstname: string;
    lastname: string;
    email: string;
    address: {
        country: string;
        city: string;
        street: string;
        zip: string;
        phone: string;
    };

    constructor(firstname?: string, lastname?: string, email?: string, address?: { country: string, city: string, street: string, zip: string, phone: string }) {
        this.firstname = firstname || '';
        this.lastname = lastname || '';
        this.email = email || '';
        this.address = address || { country: '', city: '', street: '', zip: '', phone: '' };
    };
};