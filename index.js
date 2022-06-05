import { JournalEntryForm } from "./Components/JournalEntryForm/JournalEntryForm.js";

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
