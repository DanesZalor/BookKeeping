import { Component } from "./Components/Component.js";
import { Homepage } from './Pages/Homepage.js';
import { Postpage } from "./Pages/Postpage.js";

/**
 * 
 * @param {{text:string to:string}} args 
 * @returns HTMLElement
 */
const Header = function (args = { text: "default", to: "/" }) {

    const HeaderLink = function (text, to) {
        return new Component('td', {
            className: 'HeaderLink',
            innerHTML: `<a href=${to}>${text}</a>`
        });
    }

    let THIS = new Component('div', {
        className: 'Header',
        innerHTML: `
            <table>
                <tr></tr>
            </table>
        `,
    });

    for (let obj of arguments)
        THIS.appendChild(new HeaderLink(obj.text, obj.to));


    return THIS;
};


const Switch = function () {
    let THIS = new Component('div', {});

    switch (location.pathname) {
        case "/":
            THIS.appendChild(new Homepage());
            break;
        case "/post":
            THIS.appendChild(new Postpage());
            break;

        case "/about":
            THIS.appendChild(new Component('div', {
                innerHTML: `
                <h1>About</h1>
                <p> Some description about this web app </p>
                `
            }));
            break;
        default:
            THIS.appendChild(new Component('div', {
                innerHTML: `<h1>404 Page not found</h1>${location.pathname} not found in the server`,
            }));
    }

    return THIS;
};

const PageRouter = function (args) {

};

const App = function () {

    let THIS = new Component('div', {
        className: 'App',
    });

    THIS.appendChild(new Header(
        { text: "home", to: "/" },
        { text: "new+", to: "/post" },
        { text: "about", to: "/about" },
    ));

    THIS.appendChild(new Switch());
    /*
    THIS.appendChild(new PageRouter([
        { name: "Home", to: "/", component: new Homepage() },
        { name: "Home", to: "/", component: new Homepage() },
    ]));
    */
    return THIS;
}

export { App };