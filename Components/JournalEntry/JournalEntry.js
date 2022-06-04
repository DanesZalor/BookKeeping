import { Component } from "../Component.js";
import { ContextMenu } from "../ContextMenu/ContextMenu.js";
import { JournalEntryRow } from "./JournalEntryRow/JournalEntryRow.js";


const JournalEntryRow_ContextMenu = function () {

    let THIS = new ContextMenu([
        {
            text: "insert row above", onClick: function () {
                THIS.JournalEntryParent.addRow(
                    new JournalEntryRow(), THIS.SelectedJournalEntryRow, true
                );
            }
        }, {
            text: "insert row below", onClick: function () {
                THIS.JournalEntryParent.addRow(
                    new JournalEntryRow(), THIS.SelectedJournalEntryRow, false
                );
            }
        }, {
            text: "delete row", onClick: function () {
                THIS.JournalEntryParent.removeRow(THIS.SelectedJournalEntryRow);
            }
        }, {
            text: "duplicate row", onClick: function () {
                let rowData = THIS.SelectedJournalEntryRow.getData();
                THIS.JournalEntryParent.addRow(
                    new JournalEntryRow(rowData.accountTitle, rowData.amount),
                    THIS.SelectedJournalEntryRow, true
                );
            }
        },
    ]);

    // Object.assign(THIS, { className: "JournalEntryRow_ContextMenu" })

    THIS.addEventListener('click', function () { setTimeout(THIS.JournalEntryParent.validate, 50); })
    return THIS;
}

/**
 * 
 * @param {Array} data each element must be an object { acount: string, amount: number}
 */
const JournalEntry = function (data = [{ account: "", amount: 0 }, { account: "", amount: 0 }]) {

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
                border-top-width: 1px; 
                border-top-style: solid; 
                border-top-color: #cccdcf;
            ">
                <tr class="JournalEntryFooter">
                    <td class="JournalEntrySummary">
                        <textarea placeholder="entry summary" style="resize:none;"></textarea>
                    </td>
                    <td class="JournalEntryTotalTD" style="vertical-align: top;">
                        <button disabled=true class="JournalEntryTotal" 
                        style="
                            text-align:right;
                            font-size: 14px;
                            padding: 10px 0px 10px 0px;
                            margin: -1px;
                        ">
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


        if (!(jeRow.IS_COMPONENT && jeRow.className.indexOf("JournalEntryRow") >= 0))
            throw "addRow() param 1 must be an instance of JournalEntryRow";

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

    THIS.removeRow = function (jeRow) {
        console.log("removeRow");
        let tableBody = THIS.getElementsByClassName('TableBody')[0];
        jeRow.remove();

        if (THIS.getElementsByClassName('TableBody')[0].children.length <= 1) {
            console.log("oh no");
            THIS.addRow(new JournalEntryRow());
        }

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