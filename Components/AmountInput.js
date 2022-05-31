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

    let THIS = new Component('td', {
        className: "AmountInput",
        isDebit: initialAmount >= 0,
        innerHTML: `<input placeholder="amount" 
        style="width:100px; text-align:right;" 
        value=${initialAmount}></input>`,
    });

    let inputChild = THIS.getElementsByTagName('input')[0];
    inputChild.addEventListener('keypress', (event) => {

        console.log(event.key == '.');
        if (!((event.key >= '0' && event.key <= '9') || event.key == '.')) {
            event.preventDefault();

            if (event.key == '-') THIS.isDebit = !THIS.isDebit; //console.log(THIS.isDebit);
        }

        inputChild.update();
    }, false);


    inputChild.update = function () {
        inputChild.style.width = THIS.isDebit ? "100%" : "150%";
        inputChild.style.paddingRight = THIS.isDebit ? "60%" : "10%";

    }
    inputChild.update();

    return THIS;
};


export { AmountInput }; ``