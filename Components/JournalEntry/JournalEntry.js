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
        SelectedJournalEntryRow: null,
    });

    THIS.showAt = function (x, y, selectedRow) {
        THIS.style.top = y + "px";
        THIS.style.left = x + "px";
        THIS.style.visibility = "visible";
        THIS.SelectedJournalEntryRow = selectedRow;
    }
    THIS.hide = function () {
        THIS.style.visibility = "hidden";
        THIS.SelectedJournalEntryRow = null;
    }

    /*Onclick Operations*/{

        // ADD above
        THIS.children[0].onclick = function () {
            THIS.JournalEntryParent.addRow(new JournalEntryRow(), THIS.SelectedJournalEntryRow, true);
        }

        // ADD below
        THIS.children[1].onclick = function () {
            THIS.JournalEntryParent.addRow(new JournalEntryRow(), THIS.SelectedJournalEntryRow, false);
        }

        // DELETE
        THIS.children[2].onclick = function () {
            THIS.SelectedJournalEntryRow.remove();
        }

        for (let item of THIS.children)
            item.addEventListener('click', THIS.hide);
    }



    return THIS;
};


/**
 * 
 * @param {Array} data each element must be an object { acount: string, amount: number}
 */
const JournalEntry = function (data = [{ account: "", amount: 0 }, { account: "", amount: 0 }]) {

    // check data shape, should be [ { account:string amount:int}, ... ]
    if (data != null) if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            if (!(typeof data[i].account === 'string' && typeof data[i].amount === 'number'))
                throw `JournalEntry.constructor(data) shape mismatch ${data}`;
        }
    } else throw `JournalEntry.constructor(data) shape mismatch ${data}`;


    let THIS = new Component('table', {
        innerHTML: `<tr class="JournalEntryFooter">
        <td class="JournalEntrySummary"><input placeholder="entry summary"></input></td>
        <td><input disabled=true class="JournalEntryTotal" style="text-align:right; width:150%; padding-right:10%" value="100"></input></td>
        </tr>`,
        className: "JournalEntry",
        ContextMenu: new JournalEntryRow_ContextMenu(),
    });

    THIS.appendChild(Object.assign(THIS.ContextMenu, { JournalEntryParent: THIS }));

    //THIS.addEventListener('keypress', function (event) { THIS.updateTotal(); });

    THIS.addRow = function (jeRow, pivot = null, before = true) {

        if (!(jeRow.IS_COMPONENT && jeRow.className == "JournalEntryRow"))
            throw "param 1 must be an instance of JournalEntryRow";

        // !!! ...spread does not work. it doesnt pass the Node inheritance
        jeRow.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            THIS.ContextMenu.showAt(event.pageX, event.pageY, jeRow);
        }, false);


        jeRow.getElementsByClassName('AmountInput_input')[0].addEventListener('change', () => {
            THIS.updateTotal();
        });

        if (pivot != null) THIS.insertBefore(jeRow, before ? pivot : pivot.nextSibling);
        else {
            THIS.appendChild(jeRow);
            THIS.appendChild(THIS.getElementsByClassName('JournalEntryFooter')[0]);
            // add a new row and put the footer row at the bottom
        }
    }

    THIS.updateTotal = function () {
        console.log("----");

        let AMinp = THIS.getElementsByClassName('AmountInput');
        let total = 0;
        for (let am of AMinp)
            total += am.getElementsByClassName('AmountInput_input')[0].value * (am.isDebit ? 1 : -1);

        /*assign total display*/{
            let totalLabel = THIS.getElementsByClassName('JournalEntryTotal')[0];
            totalLabel.value = (total == 0) ? "Balanced" : Math.abs(total);
            totalLabel.style.width = (total == 0) ? "125%" : (total > 0 ? "100%" : "150%");
            totalLabel.style.paddingRight = (total == 0) ? "35%" : (total > 0 ? "60%" : "10%");
        }
    }


    for (let i = 0; i < data.length; i++) // add rows and shit
        THIS.addRow(new JournalEntryRow(data[i].account, data[i].amount));


    return THIS;
};




export { JournalEntry };