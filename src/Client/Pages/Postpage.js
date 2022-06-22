import { Component } from "../Components/Component.js";
import { APIRequest } from "../Commons/APIRequest.js";
import { JournalEntryForm } from "../Components/JournalEntryForm/JournalEntryForm.js";

const Postpage = function () {
    let THIS = new Component('div', {
        className: 'Postpage',
        innerHTML: `<form method="POST" class="formContainer">
        </form>`,
    });

    let jef = new JournalEntryForm(
        [
            { account: 'Accounts Recievable', amount: 5000 },
            { account: 'Cash', amount: -3000 },
            { account: 'Assets', amount: -2000 }
        ],
        "Company X borrows supplies and some cash"
    );

    jef.getButton().onclick = function () {

        if (jef.validate()) {

            let formData = jef.getFormData();

            let strprompt = "Entry: " + formData.dateString + "\n";


            for (let row of formData.rows) {
                let line = row.account + " ".repeat(Math.max(30 - row.account.length, 0)) + Math.abs(row.amount);
                line = (row.amount >= 0 ? " " : "       ") + line;

                strprompt += line + "\n";
            }

            strprompt += formData.entrySummary;

            if (confirm(strprompt + "\n\n\tAre you sure?")) alert("submitted");
        }
        else alert("errors");
    }
    THIS.appendChild(jef);


    return THIS;
};

export { Postpage };