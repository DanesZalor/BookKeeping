import { Component } from "../Components/Component.js";

const Page404 = function () {
    return new Component('div', {
        innerHTML: `
        <h1>Error 404</h1>
        <p> ${location.pathname} not found in the server </p>
        <p> Go <a href="/">home</a> dude </p>
        `
    });
}

export { Page404 };