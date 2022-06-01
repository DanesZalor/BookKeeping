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

    THIS.validate = () => {
        if (THIS.getValue() == "") {
            return "Input cannot be empty";
        }
        else return "";
    };

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

    THIS.validate = () => {
        if (THIS.getValue() == "" || parseFloat(THIS.getValue()) == 0) {
            return "Input can't be 0";
        }
        else if (isNaN(parseFloat(THIS.getValue())))
            return "Input should be a number";
        else return "";
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
        innerHTML: `<span class="JournalEntryRow_ErrorMsg" style="display: none;">E</span>`,
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
    }, true);

    THIS.update = function () {
        accountInp.setFormat(THIS.isDebit);
        amountInp.setFormat(THIS.isDebit);
    }

    THIS.validityCheck = function () {

        let inputProblem = accountInp.validate();

        if (inputProblem.length == 0)
            inputProblem = amountInp.validate();

        let errorMsgBox = THIS.getElementsByClassName('JournalEntryRow_ErrorMsg')[0];
        errorMsgBox.innerHTML = inputProblem;
        errorMsgBox.style.display = inputProblem.length > 0 ? "inline" : "none";

        return {
            problem: inputProblem,
            amount: isNaN(amountInp.getValue()) ? 0 : amountInp.getValue() * (THIS.isDebit ? 1 : -1),
        };
    }


    THIS.insertBefore(amountInp, THIS.children[0]);
    THIS.insertBefore(accountInp, THIS.children[0]);

    THIS.update();

    return THIS;
};

export { JournalEntryRow };