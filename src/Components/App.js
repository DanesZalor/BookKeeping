import { Component } from "./Component.js";
import { EntryList } from './EntryList/EntryList.js';
import { JournalEntryForm } from './JournalEntryForm/JournalEntryForm.js';

/**
 * 
 * @param {{text:string to:string}} args 
 * @returns HTMLElement
 */
const Header = function (args = { text: "default", to: "/" }) {

    const HeaderLink = function (text, to) {
        return new Component('td', {
            className: 'HeaderLink',
            innerHTML: `<a href=${to}>${text}</a>`
        });
    }

    let THIS = new Component('div', {
        className: 'Header',
        innerHTML: `
            <table>
                <tr></tr>
            </table>
        `,
    });

    for (let obj of arguments)
        THIS.appendChild(new HeaderLink(obj.text, obj.to));


    return THIS;
};


const Switch = function () {
    let THIS = new Component('div', {});

    switch (location.pathname) {
        case "/":
            THIS.appendChild(new EntryList(
                [
                    {
                        rows: [
                            { accountTitle: "Cash", amount: 11000 },
                            { accountTitle: "Assets", amount: 1000 },
                            { accountTitle: "Accounts Payable - Bob", amount: -12000 },
                        ],
                        date: "2001-09-11",
                        summary: "Borrowed Money from Bob"
                    }, {
                        rows: [
                            { accountTitle: "Cash", amount: -1000 },
                            { accountTitle: "Accounts Payable - Bob", amount: 1000 },
                        ],
                        date: "2001-10-11",
                        summary: "Payed the money I borrowed from Bob"
                    }, {
                        rows: [
                            { accountTitle: "Cash", amount: -1000 },
                            { accountTitle: "Accounts Payable - Bob", amount: 1200 },
                        ],
                        date: "2001-10-29",
                        summary: "Payed the money I borrowed from Bob"
                    }

                ]
            ));
            break;
        case "/post":
            THIS.appendChild(new JournalEntryForm(
                [
                    { account: 'Accounts Recievable', 'amount': 5000 },
                    { account: 'Cash', amount: -3000 },
                    { account: 'Assets', amount: -2000 }
                ],
                "Company X borrows supplies and some cash"
            ));
            break;
    }

    return THIS;
}


const App = function () {
    let THIS = new Component('div', {
        className: 'App',
    });

    THIS.appendChild(new Header(
        { text: "home", to: "/" },
        { text: "new+", to: "/post" },
        { text: "about", to: "/about" },
    ));

    THIS.appendChild(new Switch());
    return THIS;
}

export { App };