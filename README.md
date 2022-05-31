# Bookkeeping

Doing this project to learn vanilla javascript because React is so confusing atm.

### Component-based programming
##### `Component.js`
```javascript
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
```

my idea here is to use this **Component** module since I want to create Javascript objects that I can add to the DOM tree. So this Component module will act as the *"base class"* for all other components that I will make. For example:

#### `InputText.js`
```javascript
import { Component } from "./path/To/Component.js";

const InputText = function (initialValue) {

    let THIS = new Component('div', {
        className: "InputText",
        innerHTML: `<input value="${initialValue}"></input>`,
    });

    THIS.reset = function() {
        console.log("resetting..");
        THIS.value = "";
    }

    return THIS;
}

export { InputText };
```

So now I can simply import the `InputText.js` Module and add it into the DOM tree like:
```javascript
var root = document.getElementById('root');
root.appendChild(new InputText("This is a test"));
```

> NOTE: that i am using Function Constructors since I can't use `extends HTMLElement` or `implements Node`.
