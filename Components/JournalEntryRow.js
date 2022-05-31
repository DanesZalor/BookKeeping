import { Component } from "./Component.js";
import { AccountTitleInput } from "./AccountTitleInput.js";
import { AmountInput } from "./AmountInput.js";

const JournalEntryRow = function (accountTitle, amount) {

    let THIS = new Component('tr', {
        className: "JournalEntryRow",
    });

    THIS.appendChild(new AccountTitleInput(accountTitle));
    THIS.appendChild(new AmountInput(amount));

    return THIS;
};

export { JournalEntryRow };