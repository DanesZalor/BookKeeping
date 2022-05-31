import { Component } from "../Component.js";
import { JournalEntryRow } from "./JournalEntryRow/JournalEntryRow.js";


const JournalEntryRow_ContextMenu = function () {

    let THIS = new Component('div', {
        className: "ContextMenu",
        style: "visibility: hidden; position:absolute;",
        innerHTML: `<div class="ContextMenuItem">Add Row Above</div>
        <div class="ContextMenuItem">Add Row Below</div>
        <div class="ContextMenuItem">Delete Row</div>
        <div class="ContextMenuItem">X</div>`,
    });

    THIS.showAt = function (x, y) {
        THIS.style.top = y + "px";
        THIS.style.left = x + "px";
        THIS.style.visibility = "visible";
    }
    THIS.hide = function () {
        THIS.style.visibility = "hidden";
        JournalEntryRow_ContextMenu.SelectedJournalEntryRow = null;
    }

    for (let item of THIS.children)
        item.addEventListener('click', THIS.hide);

    return THIS;
};

JournalEntryRow_ContextMenu.SelectedJournalEntryRow = null;


/**
 * 
 * @param {Array} data each element must be an object { acount: string, amount: number}
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
        ContextMenu: new JournalEntryRow_ContextMenu(),
    });

    THIS.appendChild(THIS.ContextMenu);

    THIS.addRow = function (jeRow, pivot = null, before = true) {

        if (!(jeRow.IS_COMPONENT && jeRow.className == "JournalEntryRow"))
            console.error("param 1 must be an instance of JournalEntryRow");

        // !!! ...spread does not work. it doesnt pass the Node inheritance
        let temprow = Object.assign(jeRow, { parent: THIS });
        temprow.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            THIS.ContextMenu.showAt(event.pageX, event.pageY);
            JournalEntryRow_ContextMenu.SelectedJournalEntryRow = temprow;
        }, false);

        if (pivot != null)
            THIS.insertBefore(temprow, before ? pivot : pivot.nextSibling);
        else THIS.appendChild(temprow);
    }

    if (data != null && data.length > 0)

        for (let i = 0; i < data.length; i++) // add rows and shit
            THIS.addRow(new JournalEntryRow(data[i].account, data[i].amount));
    else {
        THIS.addRow(new JournalEntryRow());
    }

    return THIS;
};




export { JournalEntry };