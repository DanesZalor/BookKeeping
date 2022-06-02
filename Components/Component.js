/**
 * 
 * @param {string} tagName name of html tag like 'div'|'p'|'amogus' 
 * @param {object} properties object with properties 
 * @returns HTMLElement with the **properties**  assigned to it
 */
const Component = function (tagName, properties = {}) {

    let THIS = document.createElement(tagName, { prototype: HTMLElement.prototype });
    Object.assign(THIS, properties, { IS_COMPONENT: true });

    return THIS;
}

Component.addCSS = function (filename) {
    let style = document.createElement('link');

    Object.assign(style, {
        href: filename,
        type: 'text/css',
        rel: 'stylesheet'
    });

    document.getElementsByTagName('head')[0].append(style);
};

export { Component };