import { Component } from "../../Component.js";


const JEInput = function (placeholder, value = "", properties = {}) {
    let THIS = new Component('td', {
        className: "JEInput",
        innerHTML: `<input placeholder="${placeholder}" value="${value}" 
            style="
                font-size: 15px;
                font-weight: 400;
                padding: 8px;
                margin: 0px 5px 1px 5px;
            ">
            <span class="InputErrorMsg" style="
                width:100%;
                color:#ff0000;
                font-size: 10px;
            "></span>
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
        THIS.errorBox.style.paddingLeft = msg.length == 0 ? "0px" : "20px";
        THIS.errorBox.style.visibility = msg.length == 0 ? "hidden" : "visible"
        THIS.inputChild.className = msg.length == 0 ? "Input-normal" : "Input-invalid";
    }

    return THIS;
}

const AccountInput = function (value) {
    let THIS = new JEInput("", value, { className: "AccountInput" });

    THIS.validate = () => {
        let msgreturn = "";
        if (THIS.getValue() == "") {
            msgreturn = "Input cannot be empty";
        }

        THIS.setErrorMsg(msgreturn);
        return msgreturn;
    };

    THIS.setFormat = (isDebit) => THIS.inputChild.style.paddingLeft = isDebit ? "10%" : "20%";


    return THIS;
}

const AmountInput = function (value) {

    value = parseFloat(value);
    if (isNaN(value)) value = "";

    let THIS = new JEInput("0", Math.abs(value) == 0 ? "" : Math.abs(value), { className: "AmountInput" });

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

    THIS.validate = () => {

        let msgreturn = ""
        if (THIS.getValue() == "" || parseFloat(THIS.getValue()) == 0)
            msgreturn = "Input can't be 0";

        else if (isNaN(parseFloat(THIS.getValue())))
            msgreturn = "Input should be a number";

        THIS.setErrorMsg(msgreturn);
        return msgreturn;
    }

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
        isDebit: amount >= 0,
    });

    let accountInp = new AccountInput(accountTitle)
    let amountInp = new AmountInput(amount);

    THIS.addEventListener("keypress", (event) => {
        if (event.key == '-') {
            THIS.isDebit = !THIS.isDebit;
            event.preventDefault();
            //console.log(THIS.isDebit);

            accountInp.setFormat(THIS.isDebit);
            amountInp.setFormat(THIS.isDebit);
        }
    }, true);

    THIS.update = function () {
        accountInp.setFormat(THIS.isDebit);
        amountInp.setFormat(THIS.isDebit);
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

    THIS.update();

    return THIS;
};

Component.addCSS('./Components/JournalEntry/JournalEntryRow/JournalEntryRow.css');

export { JournalEntryRow };