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

    THIS.setFormat = (isDebit) => THIS.inputChild.style.paddingLeft = isDebit ? "10%" : "20%";


    return THIS;
}

const AmountInput = function (value) {

    let THIS = new JEInput("0", Math.abs(value), { className: "AmountInput" });

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

    THIS.setFormat = (isDebit) => THIS.inputChild.style.paddingRight = isDebit ? "70%" : "20%";

    return THIS;
}

/**
 * 
 * @param {string} accountTitle 
 * @param {number} amount 
 * @returns 
 */
const JournalEntryRow = function (accountTitle, amount) {

    let THIS = new Component('tr', {
        className: "JournalEntryRow",
        isDebit: amount > 0,
    });

    let accountInp = new AccountInput(accountTitle);
    let amountInp = new AmountInput(amount);

    THIS.addEventListener("keypress", (event) => {
        if (event.key == '-') {
            THIS.isDebit = !THIS.isDebit;
            event.preventDefault();
            //console.log(THIS.isDebit);

            accountInp.setFormat(THIS.isDebit);
            amountInp.setFormat(THIS.isDebit);
        }
    }, false);

    THIS.update = function () {
        accountInp.setFormat(THIS.isDebit);
        amountInp.setFormat(THIS.isDebit);
    }

    THIS.appendChild(accountInp);
    THIS.appendChild(amountInp);

    THIS.update();

    return THIS;
};

export { JournalEntryRow };