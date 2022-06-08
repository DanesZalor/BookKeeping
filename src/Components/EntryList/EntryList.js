import { Component } from "../Component.js";

const EntryRow = function (accountTitle, amount) {

    let THIS = new Component('tr', {
        className: 'EntryRow',
        innerHTML: `
            <tr>
                <td></td>
                <td>${accountTitle}</td>
                <td>${amount}</td>
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

    THIS.appendChild(new Component('tr', {
        innerHTML: `<td></td><td>${summary}</td><td></td>`,
    }));

    return THIS;
}

const EntryList = function (data = []) {

    let THIS = new Component('table', {
        className: 'EntryList',
        innerHTML: `
            <thead>
                <tr>
                <td>Date</td>
                <td>Account Title and Explanations</td>
                <td>
                    <table>
                        <tr>Amount (Php)</tr>
                        <tr>
                            <td>Debit</td>
                            <td>Credit</td>
                        </tr>
                    </table>
                </td>
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