# Bookkeeping

Doing this project to learn vanilla javascript because React is so confusing atm.

### Reference
- https://www.accountancyknowledge.com/wp-content/uploads/2020/09/Problem-1.-Journal-Entry-min.jpg.webp

## Component-based programming (Front-End)
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

## Project Arrangement 
Arrange the directory like this; Each **Component** will have their own respective folder. A component folder should contain subfolders of components that they **comprise**. 

```
├── Components
│   ├── Component.js
│   ├── ContextMenu
│   │   ├── ContextMenu.css
│   │   └── ContextMenu.js
│   └── JournalEntryForm
│       ├── JEButton.css
│       ├── JournalEntryForm.css
│       ├── JournalEntryForm.js
│       └── JournalEntryRow
│           ├── JEInput.css
│           ├── JournalEntryRow.css
│           └── JournalEntryRow.js
├── includeCSS.php
├── index.js
└── index.php
```

`JournalEntryForm/` contains `JournalEntryRow/` and that's because **JournalEntryRow** component is a *composition* of **JournalEntryForm**.

## Including CSS

As seen in the project directory above, the `.css` files are located to their respective component. We can then use a php function that recursively searches the server directory for css files and includes it. 


```php
function searchForCSS($directory){
    
    foreach (new DirectoryIterator($directory) as $file){

        $relpath = $directory.'/'.$file->getFilename();
        
        // file is css
        if( str_ends_with($file->getFilename(), '.css'))
            echo "<link rel=\"stylesheet\" href=\"${relpath}\">";
        
        else if( // file is directory and does not start with .
            $file->isDir() && !$file->isDot() &&
            !str_starts_with($file->getFilename(), '.')
        )
            searchForCSS($relpath);
    }
}
```



## Backend

### Setup
```sql
CREATE TABLE JournalEntry(
    dateOfTransaction timestamp,
    entrySummary varchar(500),
    id SERIAL PRIMARY KEY
);

CREATE TABLE account(
    accountName varchar(200),
    PRIMARY KEY (accountName)
);

CREATE TABLE jerow(
    accountTitle varchar(200),
    amount float,
    jeid int,
    FOREIGN KEY (accountTitle) REFERENCES account(accountName),
    PRIMARY KEY (jeid, accountTitle)
);
```

For `jerow.amount`, positive values represents *debit* while negative; *credit*

### Queries

##### Registering an Account

```sql
INSERT INTO account(accountName) VALUES('Cash');
```
account titles in journal entry must be registered in the database to make journal entries more credible. Cause if we were to do the `AccountTitle` checking on the client-side, the back end might still be exploitable.


##### Submitting a Journal Entry

The process of registering a **Journal Entry** takes 2 steps:
- insert into `journalentry`

```sql
INSERT INTO  journalentry (dateoftransaction, entrysummary)
VALUES ('2001-09-11 08:13:12', '30k bank loan');
```

- add the rows into `jerow`

first, get the `journalentry.id` foreign key that we just added
```sql
SELECT id FROM journalentry WHERE entrysummary='30k bank loan' AND dateoftransaction='2001-09-11 08:13:12';
```

```sql
INSERT INTO jerow (accountTitle, amount, jeid)
VALUES ('Cash', 30000, <theRetrievedKey>);

INSERT INTO jerow (accountTitle, amount, jeid)
VALUES ('Accounts Payable', -30000, <theRetrievedKey>);
```

##### Getting a Journal Entry
```sql
SELECT * FROM jerow WHERE jeid=<journalentry.id>
```

##### Getting the SUM of a JournalEntry
```sql
SELECT SUM(amount) FROM jerow WHERE jeid=1;
```

##### Getting all Journal Entries in between dates
```sql
SELECT * FROM journalentry WHERE dateoftransaction 
BETWEEN '2001-09-10 00:00:00' AND '2001-12-31 23:59:59';
```



