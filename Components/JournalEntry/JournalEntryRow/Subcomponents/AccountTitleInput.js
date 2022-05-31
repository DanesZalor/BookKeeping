import { Component } from "../../../Component.js";

const AccountTitleInput = function (accountTitle = "") {

    let THIS = new Component('td', {
        className: "AccountTitleInput",
        innerHTML: `<input placeholder="account name" 
        style="width:300px;" 
        value="${accountTitle}"></input>`,
    });

    return THIS;
}

export { AccountTitleInput };