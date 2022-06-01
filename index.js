import { JournalEntry } from "./Components/JournalEntry/JournalEntry.js";

const root = document.getElementById('root');

var je = new JournalEntry([
    { account: 'Accounts Recievable', 'amount': 5000 },
    { account: 'Cash', amount: -3000 },
    { account: 'Assets', amount: -2000 }
]);
root.appendChild(je);
