/**
 * Homepage - Component /
 * renders the homepage that contains the ledger. The data will be queried and rendered accordingly
 */

import { Component } from "../Components/Component.js";
import { APIRequest, $_GET } from "../Commons.js";
import { EntryList } from "../Components/EntryList/EntryList.js";


const Homepage = function () {

    let THIS = new Component('div', {
        className: 'Homepage',
        innerHTML: `
            <table>
                <tbody>
                    <tr>
                        <td>From</td>
                        <td><input type="date" class="FromDate" 
                            value="${$_GET('date_from') ? $_GET('date_from') : "2000-01-01"}"/>
                        </td>
                    </tr>
                    <tr>
                        <td>To</td>
                        <td><input type="date" class="ToDate" 
                            value="${$_GET('date_to') ? $_GET('date_to') : "2030-01-01"}"/>
                        </td>
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


    APIRequest('GET', 'api/entries/',
        { date_from: date_from.value + " 00:00:00", date_to: date_to.value + " 23:59:59" },
        (response) => {
            while (entrylistholder.children.length > 0) entrylistholder.children[0].remove();
            entrylistholder.appendChild(new EntryList(JSON.parse(response)));
        }
    );


    THIS.getElementsByClassName("QueryButton")[0].onclick = () => {
        window.location.search = `date_from=${date_from.value}&date_to=${date_to.value}`;
    }

    return THIS;
};

export { Homepage };