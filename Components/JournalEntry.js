import { Component } from "./Component.js";
import { JournalEntryRow } from "./JournalEntryRow.js";

const JournalEntry = function () {
    let THIS = new Component('table', {
        className: "JournalEntry",
    });

    THIS.appendChild(new JournalEntryRow());
    THIS.appendChild(new JournalEntryRow());

    return THIS;
};

export { JournalEntry };