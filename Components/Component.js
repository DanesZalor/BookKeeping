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

export { Component };