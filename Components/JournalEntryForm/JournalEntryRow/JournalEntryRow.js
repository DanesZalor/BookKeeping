import { Component, importCSS } from "../../Component.js";

importCSS('./Components/JournalEntryForm/JournalEntryRow/JEInput.css');
importCSS('./Components/JournalEntryForm/JournalEntryRow/JournalEntryRow.css');

const JEInput = function (placeholder, value = "", properties = {}) {
    let THIS = new Component('td', {
        className: "JEInput",
        innerHTML: `<input placeholder="${placeholder}" value="${value}">
            <span class="InputErrorMsg"></span>
        </input>`,
        ...properties
    });

    THIS.inputChild = THIS.children[0];
    THIS.errorBox = THIS.children[1];

    // value getter setter
    THIS.getValue = () => THIS.inputChild.value;
    THIS.setValue = (val) => THIS.inputChild.value = val;

    THIS.setErrorMsg = function (msg) {
        THIS.errorBox.innerHTML = msg;

        if (msg.length == 0) {
            THIS.className = THIS.className.replace(" Error", "");
        } else {
            if (THIS.className.indexOf("Error") < 0)
                THIS.className = THIS.className + " Error";
        }
    }

    return THIS;
}

const AccountInput = function (value) {
    let THIS = new JEInput("", value, { className: "JEInput AccountInput" });

    THIS.validate = () => {
        let msgreturn = "";
        if (THIS.getValue() == "") {
            msgreturn = "Input cannot be empty";
        }

        THIS.setErrorMsg(msgreturn);
        return msgreturn;
    };

    return THIS;
}

const AmountInput = function (value) {

    value = parseFloat(value);
    if (isNaN(value)) value = "";

    let THIS = new JEInput("0", Math.abs(value) == 0 ? "" : Math.abs(value), { className: "JEInput AmountInput" });

    THIS.addEventListener("keypress", (event) => {

        // if pressed . and has a .
        if (event.key == '.') {
            if (THIS.getValue().indexOf('.') >= 0)
                event.preventDefault();
        }
        else if (isNaN(event.key))
            event.preventDefault();

    });

    THIS.validate = () => {

        let msgreturn = ""
        if (THIS.getValue() == "" || parseFloat(THIS.getValue()) == 0)
            msgreturn = "Input can't be 0";

        else if (isNaN(parseFloat(THIS.getValue())))
            msgreturn = "Input should be a number";

        THIS.setErrorMsg(msgreturn);
        return msgreturn;
    }

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
        className: amount >= 0 ? "JournalEntryRow Debit" : "JournalEntryRow Credit",
        isDebit: (amount >= 0),
    });


    let accountInp = new AccountInput(accountTitle)
    let amountInp = new AmountInput(amount);

    THIS.getData = function () {
        return {
            accountTitle: accountInp.getValue(),
            amount: amountInp.getValue(),
            isDebit: THIS.isDebit,
        };
    };

    THIS.addEventListener("keypress", (event) => {
        if (event.key == '-') {
            THIS.isDebit = !THIS.isDebit;
            event.preventDefault();
            //console.log(THIS.isDebit);

            THIS.updateTabs();
        }
    }, true);

    THIS.updateTabs = function () {
        THIS.className = THIS.isDebit ? "JournalEntryRow Debit" : "JournalEntryRow Credit";
    };

    THIS.setDebit = function (b) {
        THIS.isDebit = b;
        THIS.updateTabs();
    }

    THIS.validityCheck = function () {

        let accountInputError = accountInp.validate();
        let amountInputError = amountInp.validate();
        let errorMsgs = [];

        if (accountInputError.length > 0) errorMsgs.push(accountInputError);
        if (amountInputError.length > 0) errorMsgs.push(amountInputError);

        return {
            problem: errorMsgs,
            amount: isNaN(amountInp.getValue()) ? 0 : amountInp.getValue() * (THIS.isDebit ? 1 : -1),
        };
    }


    THIS.insertBefore(amountInp, THIS.children[0]);
    THIS.insertBefore(accountInp, THIS.children[0]);

    return THIS;
};



export { JournalEntryRow };