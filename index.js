import { JournalEntry } from "./Components/JournalEntry/JournalEntry.js";

const root = document.getElementById('root');

var je = new JournalEntry([
    { account: 'Sex', 'amount': 100.5 },
    { account: 'penis', amount: -100 },
    { account: 'jews', amount: -200 }
]);
root.appendChild(je);
