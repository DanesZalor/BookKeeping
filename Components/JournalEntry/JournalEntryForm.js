import { Component } from "../Component.js";
import { ContextMenu } from "../ContextMenu/ContextMenu.js";
import { JournalEntryRow } from "./JournalEntryRow/JournalEntryRow.js";

Component.addCSS('./Components/JournalEntry/JEHeader.css');
Component.addCSS('./Components/JournalEntry/JEFooter.css');

const JournalEntryRow_ContextMenu = function (xpos, ypos, selectedRow, journalEntryParent) {

    let THIS = new ContextMenu([
        {
            text: selectedRow.getData().isDebit ? "set to credit" : "set to debit", onClick: function () {
                selectedRow.setDebit(!selectedRow.isDebit);
            }
        }, {
            text: "insert row above", onClick: function () {
                journalEntryParent.addRow(
                    new JournalEntryRow(), selectedRow, true
                );
            }
        }, {
            text: "insert row below", onClick: function () {
                journalEntryParent.addRow(
                    new JournalEntryRow(), selectedRow, false
                );
            }
        }, (
            journalEntryParent.getRowCount() > 2 ? {
                text: "delete row", onClick: function () {
                    journalEntryParent.removeRow(selectedRow);
                }
            } : null
        ), {
            text: "duplicate row", onClick: function () {
                let rowData = selectedRow.getData();
                journalEntryParent.addRow(
                    new JournalEntryRow(rowData.accountTitle, rowData.amount * (rowData.isDebit ? 1 : -1)),
                    selectedRow, true
                );
            }
        },
    ], xpos, ypos);

    // when clicking anywhere in the ContextMenu, validate
    THIS.addEventListener('click', function () { setTimeout(journalEntryParent.validate, 50); })

    return THIS;
}

/**
 * 
 * @param {Array} data each element must be an object { acount: string, amount: number}
 */
const JournalEntryForm = function (data = [{ account: "", amount: 0 }, { account: "", amount: 0 }]) {

    // check data shape, should be [ { account:string amount:int}, ... ]
    if (data != null) if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            if (!(typeof data[i].account === 'string' && typeof data[i].amount === 'number'))
                throw `JournalEntry.constructor(data): shape mismatch ${data}`;
        }
    } else throw `JournalEntry.constructor(data) shape mismatch ${data}`;


    let THIS = new Component('div', {
        innerHTML: `
        <table style="
            border-collapse: collapse; 
            margin-left:auto;
            margin-right:auto;
        ">
            <thead class="TableHeader">
                <tr>
                    <td>Account Titles</td>
                    <td>
                        <table>
                        <tr>
                            <td> Debit </td>
                            <td> Credit </td>
                        </tr>
                        </table>
                    </td>
                </tr>
            </thead>
            <tbody class="TableBody">
                <!-- add rows here -->
            </tbody>
            <tbody class="TableFooter">
                <tr class="JournalEntryFooter">
                    <td class="JournalEntrySummary">
                        <textarea placeholder="entry summary" style="resize:none;"></textarea>
                    </td>
                    <td class="JournalEntryTotalTD" style="vertical-align: top;">
                        <button disabled=true class="JournalEntryTotal">
                            <span>Total</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>`,
        className: "JournalEntry",
        ContextMenu: null,
    });

    THIS.addRow = function (jeRow, pivot = null, before = true) {

        if (!(jeRow.IS_COMPONENT && jeRow.className.indexOf("JournalEntryRow") >= 0))
            throw "addRow() param 1 must be an instance of JournalEntryRow";

        jeRow.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (THIS.ContextMenu != null) THIS.ContextMenu.remove();

            THIS.ContextMenu = new JournalEntryRow_ContextMenu(event.pageX, event.pageY, jeRow, THIS);

            THIS.appendChild(THIS.ContextMenu);
        }, false);


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

    THIS.getRowCount = function () {
        return THIS.getElementsByClassName('TableBody')[0].children.length;
    }

    THIS.removeRow = function (jeRow) {
        console.log("removeRow");
        jeRow.remove();
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




export { JournalEntryForm };