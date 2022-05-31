import { Component } from "../../../Component.js";

/**
 * 
 * @param {number} initialAmount that will be put in the input box 
 * @returns 
 */
const AmountInput = function (initialAmount = 0) {

    // correct the initial amount
    initialAmount = parseFloat(initialAmount);
    if (isNaN(initialAmount))
        throw "param 1 must be a number";
    let oldAmount = initialAmount;
    //console.log(oldAmount);
    initialAmount = Math.abs(initialAmount);
    if (initialAmount == 0) initialAmount = "";

    let THIS = new Component('td', {
        className: "AmountInput",
        isDebit: oldAmount >= 0,
        innerHTML: `<input class="AmountInput_input" placeholder="0" 
        style="text-align:right;" 
        value=${initialAmount}></input>`,
    });


    let inputChild = THIS.getElementsByTagName('input')[0];
    inputChild.addEventListener('keypress', (event) => {

        if (!((event.key >= '0' && event.key <= '9') || event.key == '.')) {
            event.preventDefault();

            if (event.key == '-') {
                THIS.isDebit = !THIS.isDebit;
            }
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