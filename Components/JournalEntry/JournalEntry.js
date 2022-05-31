import { Component } from "../Component.js";
import { JournalEntryRow } from "./JournalEntryRow/JournalEntryRow.js";


/**
     * 
     * @param {Array} data 
     */
const JournalEntry = function (data) {

    // check data shape, should be [ { account:string amount:int}, ... ]
    if (data != null)
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                if (!(
                    typeof data[i].account === 'string' &&
                    typeof data[i].amount === 'number'
                )) throw `JournalEntry.constructor(data) shape mismatch ${data}`;
            }
        }
        else throw `JournalEntry.constructor(data) shape mismatch ${data}`;


    let THIS = new Component('table', {
        className: "JournalEntry",
    });

    THIS.addRow = function (jeRow, pivot = null, before = true) {

        if (!(jeRow.IS_COMPONENT && jeRow.className == "JournalEntryRow"))
            console.error("param 1 must be an instance of JournalEntryRow");

        let temprow = Object.assign(jeRow, { parent: THIS }); // NOTE: ...spread operator does not work since it doesnt pass the Node inheritance

        if (pivot != null)
            THIS.insertBefore(temprow, before ? pivot : pivot.nextSibling);
        else THIS.appendChild(temprow);
    }

    if (data != null && data.length > 0)
        // add rows and shit
        for (let i = 0; i < data.length; i++)
            THIS.addRow(new JournalEntryRow(data[i].account, data[i].amount));

    else {
        THIS.addRow(new JournalEntryRow());
    }


    return THIS;
};



export { JournalEntry };