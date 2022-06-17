/**
 * Homepage - Component /
 * renders the homepage that contains the ledger. The data will be queried and rendered accordingly
 */

import { Component } from "../Components/Component.js";
import { APIRequest } from "../Commons.js";
import { EntryList } from "../Components/EntryList/EntryList.js";


const Homepage = function () {
    let THIS = new Component('div', {
        className: 'Homepage',
        innerHTML: `
            <table>
                <tbody>
                    <tr>
                        <td>From</td>
                        <td><input type="date" class="FromDate"></input></td>
                    </tr>
                    <tr>
                        <td>To</td>
                        <td><input type="date" class="ToDate"></input></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <button class="QueryButton">Query</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="EntryListHolder"></div>
            </div>
        `
    });

    let date_from = THIS.getElementsByClassName("FromDate")[0];
    let date_to = THIS.getElementsByClassName("ToDate")[0];
    let entrylistholder = THIS.getElementsByClassName('EntryListHolder')[0];

    THIS.getElementsByClassName("QueryButton")[0].onclick = function () {
        entrylistholder.children[0].remove();
        entrylistholder.appendChild(new EntryList());
    };

    let apiResponse = [];
    APIRequest('GET', 'api/entries/', null,
        (response) => {
            entrylistholder.appendChild(new EntryList(JSON.parse(response)));
        });

    return THIS;
};

export { Homepage };