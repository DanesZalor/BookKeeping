/**
 * Homepage - Component /
 * renders the homepage that contains the ledger. The data will be queried and rendered accordingly
 */

import { Component } from "./Component.js";
import { EntryList } from "./EntryList/EntryList.js";

const Homepage = function () {
    let THIS = new Component('div', {
        className: 'Homepage',
    });


    THIS.appendChild(new EntryList());

    return THIS;
};