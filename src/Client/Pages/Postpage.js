import { Component } from "../Components/Component.js";
import { APIRequest } from "../Commons/APIRequest.js";
import { JournalEntryForm } from "../Components/JournalEntryForm/JournalEntryForm.js";

const Postpage = function () {
    let THIS = new Component('div', {
        className: 'Postpage',
        innerHTML: ``,
    });

    THIS.appendChild(new JournalEntryForm(
        [
            { account: 'Accounts Recievable', amount: 5000 },
            { account: 'Cash', amount: -3000 },
            { account: 'Assets', amount: -2000 }
        ],
        "Company X borrows supplies and some cash"
    ));

    return THIS;
};

export { Postpage };