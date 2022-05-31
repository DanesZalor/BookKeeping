import { Component } from "./Component.js";

/**
 * 
 * @param {number} initialAmount that will be put in the input box 
 * @returns 
 */
const AmountInput = function (initialAmount = 0) {

    // correct the initial amount
    initialAmount = parseFloat(initialAmount);
    if (isNaN(initialAmount))
        console.error("param 1 must be a number");

    let THIS = new Component('tr', {
        class: "col-0",
        isDebit: initialAmount >= 0,
        innerHTML: `<input placeholder="amount" 
        style="width:300px; text-align:right; padding-right:50%" 
        value=${initialAmount}></input>`,
    });

    let inputChild = THIS.getElementsByTagName('input')[0];
    inputChild.addEventListener('keypress', (event) => {

        console.log(event.key == '.');
        if (!((event.key >= '0' && event.key <= '9') || event.key == '.')) {
            event.preventDefault();

            if (event.key == '-') THIS.isDebit = !THIS.isDebit; //console.log(THIS.isDebit);
        }

        inputChild.style.paddingRight = THIS.isDebit ? "50%" : "10%";

    }, false);

    return THIS;
};


export { AmountInput }; ``