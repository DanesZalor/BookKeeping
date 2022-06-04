import { Component } from "../Component.js";

const ContextMenuItem = function (text, onClick) {
    let THIS = new Component('div', {
        className: "ContextMenuItem",
        style: ``,
        innerHTML: text,
        onclick: function () { if (onClick != null) onClick(); }
    });
    return THIS;
}

/**
 * 
 * @param {Array} data array of objects {text and functions} 
 */
const ContextMenu = function (data) {

    // check param shape
    for (let obj of data) {
        if (!(typeof obj.text == 'string' && typeof obj.onClick == 'function'))
            throw `ContextMenu.constructor(data) shape mismatch ${obj} should be {text:string, onClick: function}`;
    }

    let THIS = new Component('div', {
        className: "ContextMenu",
        style: `
            visibility: hidden; 
            position:absolute; 
            background-color: #f6f7f9;
            padding:10px;
            box-shadow: 1px 1px 5px #00000088;
            `,
    });

    THIS.showAt = function (x, y, selectedRow) {
        THIS.style.top = y + "px";
        THIS.style.left = x + "px";
        THIS.style.visibility = "visible";
        THIS.SelectedJournalEntryRow = selectedRow;
    }
    THIS.hide = function () {
        THIS.style.visibility = "hidden";
        THIS.style.top = "0px";
        THIS.style.left = "0px";
        THIS.SelectedJournalEntryRow = null;
    }

    for (let obj of data)
        THIS.appendChild(new ContextMenuItem(obj.text, obj.onClick));

    // when clicking any of the contextMenuItem, hide();
    THIS.addEventListener('click', function () {
        THIS.hide();
    });
}

export { ContextMenu };