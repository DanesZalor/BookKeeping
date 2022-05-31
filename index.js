import { AmountInput } from "./Components/AmountInput.js";
import { AccountTitleInput } from "./Components/AccountTitleInput.js";

const root = document.getElementById('root');


var ain = new AmountInput();
var acin = new AccountTitleInput("Big money");

root.appendChild(acin);
root.appendChild(ain);