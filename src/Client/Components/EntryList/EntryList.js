import { Component } from "../Component.js";

const EntryRow = function (accounttitle, amount) {

    let THIS = new Component('tr', {
        className: amount >= 0 ? 'EntryRow Debit' : 'EntryRow Credit',
        isDebit: amount > 0,
        innerHTML: `
            <tr>
                <td class='col-date'></td>
                <td class='col-acct'>${accounttitle}</td>
            ${amount >= 0 ?
                `<td class='col-dbt'>${Math.abs(amount)}</td><td class='col-cdt'></td>` :
                `<td class='col-dbt'></td><td class='col-cdt'>${Math.abs(amount)}</td>`
            }
            </tr>
        `,
    });

    return THIS;
}

const Entry = function (rows = [], date, summary) {

    let sums = { dbt: 0, cdt: 0 }
    /** precalculate sums */{
        for (let row of rows) {
            if (row.amount > 0) sums.dbt += row.amount;
            else if (row.amount < 0) sums.cdt += Math.abs(row.amount);
        }
    }

    let THIS = new Component('tbody', {
        className: (sums.dbt == sums.cdt ? 'Entry' : 'Entry HasError'),
        Totals: { Debit: sums.dbt, Credit: sums.cdt },
    });

    if (rows.length <= 0) {
        THIS.remove();
    }
    for (let row of rows)
        THIS.appendChild(new EntryRow(row.accounttitle, row.amount));

    // all #(EntryRow Debit) will be prepended
    for (let entryrow of THIS.getElementsByClassName("EntryRow Debit"))
        THIS.prepend(entryrow);


    THIS.getElementsByClassName('EntryRow')[0].getElementsByTagName('td')[0].innerHTML = date.replaceAll(" ", "<br/>");

    THIS.appendChild(new Component('tr', {
        className: "EntrySummary",
        innerHTML: `<td class='col-date'></td><td>(${summary})</td><td></td><td></td>`,
    }));

    return THIS;
}

/**
 * 
 * @param {Array} data array of objects [{ rows : [{accountTitle:string amount:number}, ...], date:string, summary:string }, ...] 
 * @returns 
 */
const EntryList = function (data = []) {

    let THIS = new Component('table', {
        className: 'EntryList',
        innerHTML: `
            <thead class='TableHeader'>
                <tr>
                    <td></td>
                    <td></td>
                    <td colspan="2">Amount (Php)</td>
                </tr>
                <tr>
                    <td>Date</td>
                    <td>Account Title and Explanations</td>
                    <td>Debit</td>
                    <td>Credit</td>
                </tr>
            </thead>
        `,
    });

    let warnAlert = false; // some entries cannot be displayed
    for (let dt of data) {
        if (dt.rows.length > 0)
            THIS.appendChild(new Entry(
                dt.rows, dt.dateoftransaction, dt.entrysummary
            ));
        else warnAlert = true;
    }

    if (warnAlert) alert("WARNING: some entries in the database cannot be displayed due to invalid data");


    /*Add Footer*/{
        let sums = { dbt: 0, cdt: 0 }

        for (let entry of THIS.getElementsByClassName('Entry')) {
            sums.dbt += parseFloat(entry.Totals.Debit);
            sums.cdt += parseFloat(entry.Totals.Credit);
        }

        THIS.appendChild(new Component('tbody', {
            className: (sums.dbt == sums.cdt ? 'EntryFooter' : 'EntryFooter HasError'),
            innerHTML: `
            <tr>
                <td colspan="2">Total</td>
                <td class="col-dbt">${sums.dbt}</td>
                <td class="col-cdt">${sums.cdt}</td>
            </tr>
        `,
        }));
    }

    return THIS;
}

export { EntryList };