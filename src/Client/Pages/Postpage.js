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
                let line = row.accounttitle + " ".repeat(Math.max(30 - row.accounttitle.length, 0)) + Math.abs(row.amount);
                line = (row.amount >= 0 ? " " : "       ") + line;
                strprompt += line + "\n";
            }

            strprompt += formData.entrySummary;

            if (confirm(strprompt + "\n\n\tAre you sure?")) {
                APIRequest('POST', 'api/entries/', {
                    entrydesc: formData.entrySummary,
                    dateoftransaction: formData.dateString,
                    rows: formData.rows
                }, (response) => {

                    let strprint = "Form Submitted:\n"; let objrsp = JSON.parse(response);
                    for (let key in objrsp)
                        strprint += `${key}: ${objrsp[key]}\n`;

                    alert(strprint);

                }, (request) => {

                    let strprint = ""; let objrsp = JSON.parse(request.response);
                    for (let key in objrsp)
                        strprint += `${key}: ${objrsp[key]}\n`;

                    alert(strprint);
                });


            }
        }
        else alert("errors");
    }
    THIS.appendChild(jef);


    return THIS;
};

export { Postpage };