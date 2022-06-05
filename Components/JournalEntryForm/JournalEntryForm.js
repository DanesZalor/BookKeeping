import { Component, importCSS } from "../Component.js";
import { ContextMenu } from "../ContextMenu/ContextMenu.js";
import { JournalEntryRow } from "./JournalEntryRow/JournalEntryRow.js";

importCSS('./Components/JournalEntryForm/JEHeader.css');
importCSS('./Components/JournalEntryForm/JEFooter.css');
importCSS('./Components/JournalEntryForm/JEButton.css');
importCSS('./Components/JournalEntryForm/JournalEntryForm.css');

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

const JournalEntrySummary = function (value = "") {
    let THIS = new Component('td', {
        className: 'JournalEntrySummary',
        innerHTML: `
        <textarea placeholder="transaction summary">${value}</textarea>
        <span class="InputErrorMsg">entry summary cannot be empty</span>
        `,
    });


    THIS.validate = function () {
        let textarea = THIS.getElementsByTagName('textarea')[0];

        let errorMsg = "";
        if (textarea.value.length == 0)
            errorMsg = "entry summary cannot be empty";
        else if (textarea.value.indexOf('fuck') >= 0)
            errorMsg = "please no bad words >:(";
        else errorMsg = "";


        THIS.getElementsByClassName('InputErrorMsg')[0].innerHTML = errorMsg;

        THIS.className = (errorMsg.length == 0) ? "JournalEntrySummary" : "JournalEntrySummary HasErrors";

        return (errorMsg.length == 0);
    };

    return THIS;
}

function validate() {
    console.log("validate call");
    return false;
}


/**
 * 
 * @param {Array} data each element must be an object { acount: string, amount: number}
 * @param {string} summary summary of transaction
 */
const JournalEntryForm = function (data = [{ account: "", amount: 0 }, { account: "", amount: 0 }], summary = "") {

    // check data shape, should be [ { account:string amount:int}, ... ]
    if (data != null) if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            if (!(typeof data[i].account === 'string' && typeof data[i].amount === 'number'))
                throw `JournalEntry.constructor(data): shape mismatch ${data}`;
        }
    } else throw `JournalEntry.constructor(data) shape mismatch ${data}`;


    let THIS = new Component('form', {
        innerHTML: `
        <table>
            <thead class="TableHeader">
                <tr>
                    <td>
                        <table>
                            <tr>
                                <td>Journal Entry Form</td>
                                <td>Jun 5, 2020</td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        PHP
                    </td>
                </tr>
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
                    <td class="JournalEntryTotalTD">
                        <button disabled=true class="JournalEntryTotal" type="submit">
                            <span>Total</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>`,
        className: "JournalEntryForm",
        ContextMenu: null,
        onSubmit: "return validate()",
        method: "post",
    });

    // Adding journalEntrySummary component
    let journalEntrySummary = new JournalEntrySummary(summary);
    journalEntrySummary.addEventListener('keyup', function () { setTimeout(THIS.validate, 50); });
    THIS.getElementsByClassName('JournalEntryFooter')[0].prepend(journalEntrySummary);

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
        let btnRes = THIS.getElementsByClassName('JournalEntryTotal')[0];
        let errors = 0;

        let total = 0;
        for (let row of rows) {
            let rowvalidityres = row.validityCheck();

            errors += rowvalidityres.problem.length > 0 ? 1 : 0;
            total += rowvalidityres.amount;
        }

        if (!journalEntrySummary.validate()) errors += 1;

        btnRes.className = "JournalEntryTotal";

        if (errors > 0) {
            btnRes.className = "JournalEntryTotal HasErrors";
            btnRes.children[0].innerHTML = "Invalid";
            btnRes.disabled = true;

        } else {
            if (total > 0)
                btnRes.className = "JournalEntryTotal DebitLeaning";
            else if (total < 0)
                btnRes.className = "JournalEntryTotal CreditLeaning";
            else if (total == 0)
                btnRes.className = "JournalEntryTotal Valid";

            btnRes.children[0].innerHTML = total == 0 ? "Submit" : Math.abs(total);
            btnRes.disabled = total != 0;

        }



    }; setTimeout(THIS.validate, 50);


    for (let i = 0; i < data.length; i++) // add rows and shit
        THIS.addRow(new JournalEntryRow(data[i].account, data[i].amount));

    return THIS;
};



export { JournalEntryForm };