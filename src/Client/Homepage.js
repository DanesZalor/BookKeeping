/**
 * Homepage - Component /
 * renders the homepage that contains the ledger. The data will be queried and rendered accordingly
 */

import { Component } from "./Component.js";
import { APIRequest } from "./Commons.js";
import { EntryList } from "./EntryList/EntryList.js";


const Homepage = function () {
    let THIS = new Component('div', {
        className: 'Homepage',
    });

    let apiResponse = [];
    APIRequest('GET', 'api/entries/', null,
        (response) => {
            THIS.appendChild(new EntryList(JSON.parse(response)));
        });



    return THIS;
};

export { Homepage };