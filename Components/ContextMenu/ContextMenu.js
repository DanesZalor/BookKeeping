import { Component } from "../Component.js";

Component.addCSS('./Components/ContextMenu/ContextMenu.css');

const ContextMenuItem = function (text, onClick) {
    let THIS = new Component('div', {
        className: "ContextMenuItem",
        innerHTML: text,
        onclick: function () { if (onClick != null) onClick(); }
    });

    THIS.setText = function (t) { THIS.innerHTML = t; };

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
        className: "ContextMenu"
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

    THIS.visible = () => THIS.style.visibility == "visible";

    for (let obj of data)
        THIS.appendChild(new ContextMenuItem(obj.text, obj.onClick));


    THIS.addEventListener('click', THIS.hide); // when clicking any of the contextMenuItem, hide();
    window.addEventListener('click', THIS.hide); // when clicking anywhere on the page, hide();

    return THIS;
}

export { ContextMenu };