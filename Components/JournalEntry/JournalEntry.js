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
        THIS.style.top = "2000px";
        THIS.style.left = "2000px";
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
            item.addEventListener('click',
                function () {
                    THIS.hide();
                    setTimeout(THIS.JournalEntryParent.validate, 50)
                }
            );
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


    let THIS = new Component('div', {
        innerHTML: `
        <table style="
            border-collapse: collapse; 
            border-style: outset; 
            border-width:2px;
            border-color: #dcdddf;
            background:#ecedef;
            margin:auto;
        ">
            <thead class="TableHeader">
                <tr>
                    <td style="text-align:center;">Account Titles</td>
                    <td>
                        <div style="text-align:center;">(Php)</div>
                        <table>
                        <tr>
                            <td style="text-align:center;"> Debit </td>
                            <td style="text-align:center;"> Crebit </td>
                        </tr>
                        </table>
                    </td>
                </tr>
            </thead>
            <tbody class="TableBody">
                <!-- add rows here -->
            </tbody>
            <tbody class="TableFooter" style="
                border-top-width: 2px; 
                border-top-style: inset; 
                border-top-color: #dcdddf;
            ">
                <tr class="JournalEntryFooter">
                    <td class="JournalEntrySummary">
                        <textarea placeholder="entry summary" style="resize:none;"></textarea>
                    </td>
                    <td class="JournalEntryTotalTD" style="vertical-align: top;">
                        <button disabled=true class="JournalEntryTotal" style="text-align:right;">
                            <span>Total</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>`,
        className: "JournalEntry",
        ContextMenu: new JournalEntryRow_ContextMenu(),
    });

    THIS.appendChild(Object.assign(THIS.ContextMenu, { JournalEntryParent: THIS }));


    THIS.addRow = function (jeRow, pivot = null, before = true) {

        if (!(jeRow.IS_COMPONENT && jeRow.className == "JournalEntryRow"))
            throw "param 1 must be an instance of JournalEntryRow";

        // !!! ...spread does not work. it doesnt pass the Node inheritance
        {
            let contextMenuFunc = (event) => {
                event.preventDefault();
                THIS.ContextMenu.showAt(event.pageX, event.pageY, jeRow);
            }
            jeRow.children[0].addEventListener('contextmenu', contextMenuFunc, false);
            jeRow.children[1].addEventListener('contextmenu', contextMenuFunc, false);
        }



        /*add events signals*/{
            jeRow.addEventListener('keyup', THIS.validate);
            jeRow.addEventListener('change', THIS.validate);
        }

        let tableBody = THIS.getElementsByClassName('TableBody')[0];
        if (pivot != null)
            tableBody.insertBefore(jeRow, before ? pivot : pivot.nextSibling);
        else
            tableBody.appendChild(jeRow);

    }

    THIS.validate = function () {

        let rows = THIS.getElementsByClassName('JournalEntryRow');
        let btnRes = THIS.getElementsByClassName('JournalEntryTotal')[0].children[0];
        let errors = 0;

        let total = 0;
        for (let row of rows) {
            let rowvalidityres = row.validityCheck();

            errors += rowvalidityres.problem.length > 0 ? 1 : 0;
            total += rowvalidityres.amount;
        }



        if (errors > 0) {
            btnRes.style.paddingRight = "45%";
            btnRes.innerHTML = "Invalid";
            btnRes.parentElement.disabled = true;
        } else {
            btnRes.style.paddingRight = total == 0 ? "45%" : (total > 0 ? "70%" : "20%");
            btnRes.innerHTML = total == 0 ? "Submit" : total;
            btnRes.parentElement.disabled = total != 0;
        }



    }; setTimeout(THIS.validate, 50);


    for (let i = 0; i < data.length; i++) // add rows and shit
        THIS.addRow(new JournalEntryRow(data[i].account, data[i].amount));


    return THIS;
};




export { JournalEntry };