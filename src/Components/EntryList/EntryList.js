import { Component } from "../Component.js";

const EntryRow = function (accountTitle, amount) {

    let THIS = new Component('tr', {
        className: 'EntryRow',
        innerHTML: `
            <tr>
                <td class='col-date'></td>
                <td class='col-acct'>${accountTitle}</td>
            ${amount >= 0 ?
                `<td class='col-dbt'>${Math.abs(amount)}</td><td class='col-cdt'></td>` :
                `<td class='col-dbt'></td><td class='col-cdt'>${Math.abs(amount)}</td>`
            }
            </tr>
        `
    });

    return THIS;
}

const Entry = function (rows = [], date, summary) {

    let THIS = new Component('tbody', {
        className: 'Entry',
    });

    for (let row of rows)
        THIS.appendChild(new EntryRow(row.accountTitle, row.amount));

    THIS.getElementsByClassName('EntryRow')[0].getElementsByTagName('td')[0].innerHTML = date;

    THIS.appendChild(new Component('tr', {
        className: "EntrySummary",
        innerHTML: `<td></td><td>${summary}</td><td></td>`,
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

    for (let dt of data) {
        THIS.appendChild(new Entry(
            dt.rows, dt.date, dt.summary
        ));
    }

    return THIS;
}

export { EntryList };