import { Component } from "./jsClass/Component.js";
import { AmountInput } from "./jsClass/AmountInput.js";

const root = document.getElementById('root');

var dn = new Component('p', { innerHTML: 'sex', onclick: () => { alert('DO NOT CLICK'); } });

var ain = new AmountInput('3sex');

root.appendChild(dn);
root.appendChild(ain);