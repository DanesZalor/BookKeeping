import { Component } from "./Components/Component.js";
import { Homepage } from './Pages/Homepage.js';
import { Postpage } from "./Pages/Postpage.js";
import { Aboutpage } from "./Pages/Aboutpage.js";
import { Page404 } from "./Pages/404page.js";


/**
 * 
 * @param {array} args ex: {text:"home", to:"/", htmlObj: Component Constructor}
 */
const PageRouter = function (args) {
    let THIS = new Component('div', {
        className: 'PageRouter',
        innerHTML: `
        <div class="PageHeader">
            <table><tr class="linksRow"></tr></table>
        </div>
        <div class="PageRenderer">
        </div>
        `,
    });

    let linskHolder = THIS.getElementsByClassName('linksRow')[0];

    for (let arg of args) {
        linskHolder.appendChild(
            new Component('a', { href: arg.to, innerHTML: arg.text })
        );
    }

    let pageHolder = THIS.getElementsByClassName('PageRenderer')[0];

    let pathfound = false
    for (let arg of args) {
        if (location.pathname == arg.to) {
            pathfound = true;
            pageHolder.appendChild(new arg.htmlObj());
            break;
        }
    }

    if (!pathfound) {
        pageHolder.appendChild(new Page404());
    }

    return THIS;
};

const App = function () {

    let THIS = new Component('div', {
        className: 'App',
    });

    THIS.appendChild(new PageRouter([
        { text: "ledger", to: "/", htmlObj: Homepage },
        { text: "new entry", to: "/post", htmlObj: Postpage },
        { text: "About", to: "/about", htmlObj: Aboutpage },
    ]));

    return THIS;
}

export { App };