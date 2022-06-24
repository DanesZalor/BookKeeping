import { Component } from "../Components/Component.js";

const Aboutpage = function () {
    return new Component('div', {
        innerHTML: `
        <h1>About</h1>
        <p> Some description about this web app </p>
        `
    });
}

export { Aboutpage };