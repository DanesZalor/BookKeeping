import { Component } from "../Component.js";

const EntryRow = function (accountTitle, amount) {

    let THIS = new Component('tr', {
        className: amount >= 0 ? 'EntryRow Debit' : 'EntryRow Credit',
        innerHTML: `
            <tr>
                <td class='col-date'></td>
                <td class='col-acct'>${accountTitle}</td>
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

    for (let row of rows)
        THIS.appendChild(new EntryRow(row.accountTitle, row.amount));

    THIS.getElementsByClassName('EntryRow')[0].getElementsByTagName('td')[0].innerHTML = date;

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

    for (let dt of data)
        THIS.appendChild(new Entry(
            dt.rows, dt.date, dt.summary
        ));

    /*Add Footer*/{
        let sums = { dbt: 0, cdt: 0 }

        for (let entry of THIS.getElementsByClassName('Entry')) {
            sums.dbt += entry.Totals.Debit;
            sums.cdt += entry.Totals.Credit;
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