import { JournalEntryForm } from "./Components/JournalEntryForm/JournalEntryForm.js";

import { EntryList } from "./Components/EntryList/EntryList.js";


const root = document.getElementById('root');


var je = new JournalEntryForm(
    [
        { account: 'Accounts Recievable', 'amount': 5000 },
        { account: 'Cash', amount: -3000 },
        { account: 'Assets', amount: -2000 }
    ],
    "Company X borrows supplies and some cash"
);
root.appendChild(je);



root.appendChild(new EntryList(
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