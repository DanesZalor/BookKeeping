import { Component, importCSS } from "../Component.js";

importCSS('./Components/ContextMenu/ContextMenu.css');

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
const ContextMenu = function (data, xpos, ypos) {

    // check param shape
    for (let obj of data) {
        if (obj == null) continue;
        if (!(typeof obj.text == 'string' && typeof obj.onClick == 'function'))
            throw `ContextMenu.constructor(data) shape mismatch ${obj} should be {text:string, onClick: function}`;
    }

    let THIS = new Component('div', {
        className: "ContextMenu"
    });

    THIS.style.top = ypos + "px";
    THIS.style.left = xpos + "px";

    for (let obj of data) {
        if (obj == null) continue;
        THIS.appendChild(new ContextMenuItem(obj.text, obj.onClick));
    }

    THIS.addEventListener('click', THIS.remove);
    window.addEventListener('click', function () { THIS.remove(); });

    return THIS;
}

export { ContextMenu };