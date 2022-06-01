import { Component } from "../../Component.js";


const JEInput = function (placeholder, value = "", properties = {}) {
    let THIS = new Component('td', {
        className: "JEInput",
        innerHTML: `<input placeholder="${placeholder}" value="${value}" 
            style="">
        </input>`,
        ...properties
    });

    THIS.inputChild = THIS.children[0];
    // value getter setter
    THIS.getValue = () => THIS.inputChild.value;
    THIS.setValue = (val) => THIS.inputChild.value = val;

    return THIS;
}

const AccountInput = function (value) {
    let THIS = new JEInput("", value, { className: "AccountInput" });

    THIS.validate = () => THIS.getValue() != "";

    return THIS;
}

const AmountInput = function (value) {
    let THIS = new JEInput("0", value, { className: "AmountInput" });

    THIS.inputChild.style.textAlign = "right";

    THIS.addEventListener("keypress", (event) => {

        // if pressed . and has a .
        if (event.key == '.') {
            if (THIS.getValue().indexOf('.') >= 0)
                event.preventDefault();
        }
        else if (isNaN(event.key))
            event.preventDefault();

    });

    THIS.validate = () => !isNaN(parseFloat(THIS.getValue()));

    return THIS;
}

const JournalEntryRow = function (accountTitle, amount) {

    let THIS = new Component('tr', {
        className: "JournalEntryRow",
    });

    let accountInp = new AccountInput(accountTitle);
    let amountInp = new AmountInput(amount);

    THIS.addEventListener("keypress", (event) => {
        if (event.key = '-') {

        }
    });

    THIS.appendChild(accountInp);
    THIS.appendChild(amountInp);

    return THIS;
};

export { JournalEntryRow };