export interface LessonContent {
  id: string;
  title: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'exercise';
  duration: number;
  content: string;
  codeExamples?: CodeExample[];
  quiz?: QuizQuestion[];
  exercise?: Exercise;
}

export interface CodeExample {
  id: string;
  title: string;
  code: string;
  language: string;
  explanation: string;
  runnable?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  tests: string[];
  hints: string[];
}

export const courseContent = {
  'javascript-fundamentals': {
    title: 'JavaScript Fundamentals',
    modules: [
      {
        id: 'variables-datatypes',
        title: 'Variables and Data Types',
        lessons: [
          {
            id: 'intro-variables',
            title: 'Introduction to Variables',
            type: 'text' as const,
            duration: 8,
            content: `
# Variables in JavaScript

Variables are containers that store data values. In JavaScript, you can declare variables using three keywords:

## var, let, and const

### let - Block Scoped
\`let\` is the modern way to declare variables that can be reassigned:

\`\`\`javascript
let name = "John";
let age = 25;
age = 26; // Can be reassigned
\`\`\`

### const - Constants
\`const\` declares variables that cannot be reassigned:

\`\`\`javascript
const PI = 3.14159;
const colors = ["red", "green", "blue"];
// PI = 3.14; // Error! Cannot reassign
\`\`\`

### var - Function Scoped (Legacy)
\`var\` is the old way, avoid using it in modern JavaScript:

\`\`\`javascript
var oldStyle = "avoid this";
\`\`\`

## Variable Naming Rules

1. Must start with a letter, underscore (_), or dollar sign ($)
2. Can contain letters, numbers, underscores, and dollar signs
3. Case-sensitive (myVar and myvar are different)
4. Cannot use reserved keywords (let, const, function, etc.)

## Best Practices

- Use descriptive names: \`userAge\` instead of \`a\`
- Use camelCase: \`firstName\` not \`first_name\`
- Use const by default, let when you need to reassign
- Never use var in modern JavaScript
            `,
            codeExamples: [
              {
                id: 'variable-declaration',
                title: 'Variable Declaration Examples',
                code: `// Good variable declarations
let userName = "Alice";
let userAge = 30;
let isLoggedIn = true;

const MAX_USERS = 100;
const API_URL = "https://api.example.com";

// Variables can be reassigned (let only)
userName = "Bob";
userAge = 31;

console.log(userName, userAge, isLoggedIn);`,
                language: 'javascript',
                explanation: 'This example shows proper variable declaration using let and const.',
                runnable: true
              }
            ]
          },
          {
            id: 'data-types',
            title: 'JavaScript Data Types',
            type: 'interactive' as const,
            duration: 12,
            content: `
# JavaScript Data Types

JavaScript has several built-in data types. Understanding these is crucial for effective programming.

## Primitive Data Types

### 1. Number
JavaScript has only one number type - it can be integers or decimals:

\`\`\`javascript
let age = 25;           // Integer
let price = 99.99;      // Decimal
let negative = -10;     // Negative number
let infinity = Infinity; // Special number value
\`\`\`

### 2. String
Text data enclosed in quotes:

\`\`\`javascript
let name = "John";      // Double quotes
let city = 'New York';  // Single quotes
let message = \`Hello \${name}\`; // Template literals
\`\`\`

### 3. Boolean
True or false values:

\`\`\`javascript
let isActive = true;
let isComplete = false;
\`\`\`

### 4. Undefined
Variable declared but not assigned:

\`\`\`javascript
let x;
console.log(x); // undefined
\`\`\`

### 5. Null
Intentionally empty value:

\`\`\`javascript
let data = null; // Explicitly no value
\`\`\`

## Non-Primitive Data Types

### 6. Object
Collections of key-value pairs:

\`\`\`javascript
let person = {
  name: "John",
  age: 30,
  city: "New York"
};
\`\`\`

### 7. Array
Ordered lists of values:

\`\`\`javascript
let colors = ["red", "green", "blue"];
let numbers = [1, 2, 3, 4, 5];
\`\`\`

## Type Checking

Use \`typeof\` operator to check data types:

\`\`\`javascript
console.log(typeof 42);        // "number"
console.log(typeof "hello");   // "string"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object" (this is a known bug!)
console.log(typeof {});        // "object"
console.log(typeof []);        // "object"
\`\`\`
            `,
            codeExamples: [
              {
                id: 'data-types-demo',
                title: 'Data Types in Action',
                code: `// Different data types
let num = 42;
let str = "Hello World";
let bool = true;
let arr = [1, 2, 3];
let obj = { name: "John", age: 30 };
let nothing = null;
let notDefined;

// Check types
console.log("Number:", typeof num);
console.log("String:", typeof str);
console.log("Boolean:", typeof bool);
console.log("Array:", typeof arr);
console.log("Object:", typeof obj);
console.log("Null:", typeof nothing);
console.log("Undefined:", typeof notDefined);

// Type conversion examples
console.log("String to Number:", Number("123"));
console.log("Number to String:", String(456));
console.log("Boolean conversion:", Boolean(0), Boolean(1));`,
                language: 'javascript',
                explanation: 'This demonstrates all JavaScript data types and type checking.',
                runnable: true
              }
            ],
            quiz: [
              {
                id: 'q1',
                question: 'What will typeof null return?',
                options: ['null', 'undefined', 'object', 'boolean'],
                correct: 2,
                explanation: 'This is a known bug in JavaScript. typeof null returns "object" instead of "null".'
              },
              {
                id: 'q2',
                question: 'Which keyword should you use for variables that won\'t be reassigned?',
                options: ['var', 'let', 'const', 'final'],
                correct: 2,
                explanation: 'const should be used for variables that won\'t be reassigned, as it prevents accidental changes.'
              }
            ]
          },
          {
            id: 'type-conversion',
            title: 'Type Conversion and Coercion',
            type: 'text' as const,
            duration: 10,
            content: `
# Type Conversion in JavaScript

JavaScript can convert between types automatically (coercion) or manually (conversion).

## Automatic Type Coercion

JavaScript automatically converts types when needed:

\`\`\`javascript
console.log("5" + 3);    // "53" (number to string)
console.log("5" - 3);    // 2 (string to number)
console.log("5" * "2");  // 10 (both strings to numbers)
console.log(true + 1);   // 2 (boolean to number)
\`\`\`

## Manual Type Conversion

### To String
\`\`\`javascript
let num = 123;
let str1 = String(num);        // "123"
let str2 = num.toString();     // "123"
let str3 = "" + num;           // "123"
\`\`\`

### To Number
\`\`\`javascript
let str = "123";
let num1 = Number(str);        // 123
let num2 = parseInt(str);      // 123 (integers only)
let num3 = parseFloat(str);    // 123 (decimals too)
let num4 = +str;               // 123
\`\`\`

### To Boolean
\`\`\`javascript
let value = "hello";
let bool1 = Boolean(value);    // true
let bool2 = !!value;           // true
\`\`\`

## Falsy Values

These values convert to false:
- \`false\`
- \`0\`
- \`""\` (empty string)
- \`null\`
- \`undefined\`
- \`NaN\`

Everything else is truthy!

## Common Pitfalls

\`\`\`javascript
console.log(0 == false);     // true (coercion)
console.log(0 === false);    // false (strict comparison)
console.log("" == 0);        // true (coercion)
console.log("" === 0);       // false (strict comparison)
\`\`\`

**Always use === for comparisons to avoid unexpected coercion!**
            `,
            exercise: {
              id: 'type-conversion-exercise',
              title: 'Type Conversion Practice',
              description: 'Complete the functions to convert between different types correctly.',
              starterCode: `// Convert string to number safely
function safeStringToNumber(str) {
  // Your code here
  // Return the number or 0 if conversion fails
}

// Convert any value to boolean
function toBoolean(value) {
  // Your code here
  // Return true or false
}

// Check if a value is a valid number
function isValidNumber(value) {
  // Your code here
  // Return true if it's a valid number, false otherwise
}

// Test your functions
console.log(safeStringToNumber("123"));    // Should be 123
console.log(safeStringToNumber("abc"));    // Should be 0
console.log(toBoolean("hello"));           // Should be true
console.log(toBoolean(""));                // Should be false
console.log(isValidNumber(123));           // Should be true
console.log(isValidNumber("abc"));         // Should be false`,
              solution: `function safeStringToNumber(str) {
  const num = Number(str);
  return isNaN(num) ? 0 : num;
}

function toBoolean(value) {
  return Boolean(value);
}

function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}`,
              tests: [
                'safeStringToNumber("123") === 123',
                'safeStringToNumber("abc") === 0',
                'toBoolean("hello") === true',
                'toBoolean("") === false',
                'isValidNumber(123) === true',
                'isValidNumber("abc") === false'
              ],
              hints: [
                'Use Number() function for conversion and check with isNaN()',
                'Boolean() function converts any value to boolean',
                'Check both typeof and isNaN() for valid numbers'
              ]
            }
          }
        ]
      },
      {
        id: 'functions-scope',
        title: 'Functions and Scope',
        lessons: [
          {
            id: 'function-basics',
            title: 'Function Declaration and Expression',
            type: 'text' as const,
            duration: 15,
            content: `
# JavaScript Functions

Functions are reusable blocks of code that perform specific tasks.

## Function Declaration

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice")); // "Hello, Alice!"
\`\`\`

## Function Expression

\`\`\`javascript
const greet = function(name) {
  return "Hello, " + name + "!";
};
\`\`\`

## Arrow Functions (ES6)

\`\`\`javascript
// Basic arrow function
const greet = (name) => {
  return "Hello, " + name + "!";
};

// Shorter syntax for single expressions
const greet = name => "Hello, " + name + "!";

// Multiple parameters
const add = (a, b) => a + b;

// No parameters
const sayHello = () => "Hello!";
\`\`\`

## Parameters and Arguments

\`\`\`javascript
// Default parameters
function greet(name = "World") {
  return "Hello, " + name + "!";
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 10
\`\`\`

## Return Values

\`\`\`javascript
function calculate(a, b) {
  const sum = a + b;
  const product = a * b;
  
  // Return multiple values as object
  return {
    sum: sum,
    product: product
  };
}

const result = calculate(5, 3);
console.log(result.sum);     // 8
console.log(result.product); // 15
\`\`\`

## Function Hoisting

Function declarations are "hoisted" - you can call them before they're defined:

\`\`\`javascript
sayHello(); // Works!

function sayHello() {
  console.log("Hello!");
}
\`\`\`

But function expressions are not hoisted:

\`\`\`javascript
sayHello(); // Error!

const sayHello = function() {
  console.log("Hello!");
};
\`\`\`
            `,
            codeExamples: [
              {
                id: 'function-examples',
                title: 'Function Examples',
                code: `// Function declaration
function calculateArea(width, height) {
  return width * height;
}

// Function expression
const calculatePerimeter = function(width, height) {
  return 2 * (width + height);
};

// Arrow function
const calculateDiagonal = (width, height) => {
  return Math.sqrt(width * width + height * height);
};

// Function with default parameters
function createUser(name, age = 18, role = "user") {
  return {
    name: name,
    age: age,
    role: role,
    id: Math.random().toString(36).substr(2, 9)
  };
}

// Test the functions
console.log("Area:", calculateArea(5, 3));
console.log("Perimeter:", calculatePerimeter(5, 3));
console.log("Diagonal:", calculateDiagonal(5, 3));
console.log("User:", createUser("Alice"));
console.log("Admin:", createUser("Bob", 25, "admin"));`,
                language: 'javascript',
                explanation: 'Different ways to create and use functions in JavaScript.',
                runnable: true
              }
            ]
          },
          {
            id: 'scope-closures',
            title: 'Scope and Closures',
            type: 'interactive' as const,
            duration: 18,
            content: `
# Scope and Closures

Understanding scope is crucial for writing maintainable JavaScript code.

## Global Scope

Variables declared outside any function have global scope:

\`\`\`javascript
let globalVar = "I'm global";

function showGlobal() {
  console.log(globalVar); // Accessible everywhere
}
\`\`\`

## Function Scope

Variables declared inside a function are only accessible within that function:

\`\`\`javascript
function myFunction() {
  let localVar = "I'm local";
  console.log(localVar); // Works
}

console.log(localVar); // Error! Not accessible outside
\`\`\`

## Block Scope

\`let\` and \`const\` have block scope (within {}):

\`\`\`javascript
if (true) {
  let blockVar = "I'm in a block";
  const alsoBlock = "Me too";
}

console.log(blockVar); // Error! Not accessible outside block
\`\`\`

## Closures

A closure is when an inner function has access to outer function's variables:

\`\`\`javascript
function outerFunction(x) {
  // Outer function's variable
  let outerVar = x;
  
  // Inner function has access to outerVar
  function innerFunction(y) {
    return outerVar + y;
  }
  
  return innerFunction;
}

const addFive = outerFunction(5);
console.log(addFive(3)); // 8 (5 + 3)
\`\`\`

## Practical Closure Example

\`\`\`javascript
function createCounter() {
  let count = 0;
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
\`\`\`

## Module Pattern with Closures

\`\`\`javascript
const Calculator = (function() {
  // Private variables
  let result = 0;
  
  // Private function
  function log(operation, value) {
    console.log(\`\${operation}: \${value}\`);
  }
  
  // Public API
  return {
    add: function(x) {
      result += x;
      log("Added", x);
      return this;
    },
    multiply: function(x) {
      result *= x;
      log("Multiplied by", x);
      return this;
    },
    getResult: function() {
      return result;
    },
    reset: function() {
      result = 0;
      return this;
    }
  };
})();

// Usage
Calculator.add(5).multiply(2).add(3);
console.log(Calculator.getResult()); // 13
\`\`\`
            `,
            exercise: {
              id: 'closure-exercise',
              title: 'Create a Bank Account with Closures',
              description: 'Create a function that returns a bank account object with private balance.',
              starterCode: `function createBankAccount(initialBalance = 0) {
  // Your code here
  // Create a private balance variable
  // Return an object with deposit, withdraw, and getBalance methods
  // Make sure balance cannot be accessed directly
}

// Test your bank account
const account = createBankAccount(100);
console.log(account.getBalance()); // Should be 100
console.log(account.deposit(50));  // Should be 150
console.log(account.withdraw(30)); // Should be 120
console.log(account.withdraw(200)); // Should handle insufficient funds`,
              solution: `function createBankAccount(initialBalance = 0) {
  let balance = initialBalance;
  
  return {
    deposit: function(amount) {
      if (amount > 0) {
        balance += amount;
        return balance;
      }
      throw new Error("Deposit amount must be positive");
    },
    
    withdraw: function(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return balance;
      }
      throw new Error("Invalid withdrawal amount");
    },
    
    getBalance: function() {
      return balance;
    }
  };
}`,
              tests: [
                'account.getBalance() === 100',
                'account.deposit(50) === 150',
                'account.withdraw(30) === 120'
              ],
              hints: [
                'Use a private variable inside the function',
                'Return an object with methods that access the private variable',
                'Add validation for deposit and withdrawal amounts'
              ]
            }
          }
        ]
      },
      {
        id: 'dom-manipulation',
        title: 'DOM Manipulation',
        lessons: [
          {
            id: 'dom-selection',
            title: 'Selecting DOM Elements',
            type: 'interactive' as const,
            duration: 12,
            content: `
# DOM Selection Methods

The Document Object Model (DOM) represents the HTML structure. JavaScript can interact with it.

## Basic Selection Methods

### getElementById
Select element by its ID:

\`\`\`javascript
const header = document.getElementById('main-header');
\`\`\`

### getElementsByClassName
Select elements by class name (returns HTMLCollection):

\`\`\`javascript
const buttons = document.getElementsByClassName('btn');
\`\`\`

### getElementsByTagName
Select elements by tag name:

\`\`\`javascript
const paragraphs = document.getElementsByTagName('p');
\`\`\`

## Modern Selection Methods

### querySelector
Select first element matching CSS selector:

\`\`\`javascript
const firstButton = document.querySelector('.btn');
const header = document.querySelector('#main-header');
const firstParagraph = document.querySelector('p');
\`\`\`

### querySelectorAll
Select all elements matching CSS selector (returns NodeList):

\`\`\`javascript
const allButtons = document.querySelectorAll('.btn');
const allParagraphs = document.querySelectorAll('p');
\`\`\`

## Working with Selected Elements

### Changing Content
\`\`\`javascript
const heading = document.querySelector('h1');
heading.textContent = 'New heading text';
heading.innerHTML = '<em>Emphasized</em> heading';
\`\`\`

### Changing Attributes
\`\`\`javascript
const image = document.querySelector('img');
image.src = 'new-image.jpg';
image.alt = 'New description';
image.setAttribute('data-id', '123');
\`\`\`

### Changing Styles
\`\`\`javascript
const element = document.querySelector('.box');
element.style.backgroundColor = 'blue';
element.style.fontSize = '20px';
element.style.display = 'none';
\`\`\`

### Adding/Removing Classes
\`\`\`javascript
const element = document.querySelector('.box');
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('highlighted');
element.classList.contains('active'); // returns boolean
\`\`\`

## Creating and Adding Elements

\`\`\`javascript
// Create new element
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello World';
newDiv.className = 'new-element';

// Add to DOM
const container = document.querySelector('.container');
container.appendChild(newDiv);

// Insert at specific position
container.insertBefore(newDiv, container.firstChild);
\`\`\`

## Removing Elements

\`\`\`javascript
const element = document.querySelector('.to-remove');
element.remove(); // Modern way
// or
element.parentNode.removeChild(element); // Older way
\`\`\`
            `,
            codeExamples: [
              {
                id: 'dom-manipulation-demo',
                title: 'DOM Manipulation Demo',
                code: `// Create a simple HTML structure in memory for demo
document.body.innerHTML = \`
  <div class="container">
    <h1 id="title">Original Title</h1>
    <p class="text">First paragraph</p>
    <p class="text">Second paragraph</p>
    <button class="btn primary">Click me</button>
    <button class="btn secondary">Or me</button>
  </div>
\`;

// Select elements
const title = document.getElementById('title');
const paragraphs = document.querySelectorAll('.text');
const buttons = document.querySelectorAll('.btn');
const container = document.querySelector('.container');

// Modify content
title.textContent = 'Updated Title!';
title.style.color = 'blue';

// Modify paragraphs
paragraphs.forEach((p, index) => {
  p.textContent = \`Updated paragraph \${index + 1}\`;
  p.style.fontWeight = 'bold';
});

// Modify buttons
buttons.forEach((btn, index) => {
  btn.textContent = \`Button \${index + 1}\`;
  btn.style.margin = '5px';
  btn.style.padding = '10px';
  btn.style.backgroundColor = index === 0 ? 'green' : 'orange';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
});

// Add new element
const newElement = document.createElement('div');
newElement.innerHTML = '<strong>Dynamically added element!</strong>';
newElement.style.backgroundColor = 'lightblue';
newElement.style.padding = '10px';
newElement.style.margin = '10px 0';
container.appendChild(newElement);

console.log('DOM manipulation complete!');`,
                language: 'javascript',
                explanation: 'This example demonstrates various DOM manipulation techniques.',
                runnable: true
              }
            ]
          },
          {
            id: 'event-handling',
            title: 'Event Handling',
            type: 'text' as const,
            duration: 15,
            content: `
# Event Handling in JavaScript

Events are actions that happen in the browser - clicks, key presses, page loads, etc.

## Adding Event Listeners

### addEventListener Method
\`\`\`javascript
const button = document.querySelector('#my-button');

button.addEventListener('click', function() {
  console.log('Button clicked!');
});

// Or with arrow function
button.addEventListener('click', () => {
  console.log('Button clicked!');
});
\`\`\`

### Multiple Event Listeners
\`\`\`javascript
const button = document.querySelector('#my-button');

button.addEventListener('click', handleClick);
button.addEventListener('mouseover', handleMouseOver);
button.addEventListener('mouseout', handleMouseOut);

function handleClick() {
  console.log('Clicked!');
}

function handleMouseOver() {
  console.log('Mouse over!');
}

function handleMouseOut() {
  console.log('Mouse out!');
}
\`\`\`

## Common Events

### Mouse Events
- \`click\` - Element is clicked
- \`dblclick\` - Element is double-clicked
- \`mouseover\` - Mouse enters element
- \`mouseout\` - Mouse leaves element
- \`mousemove\` - Mouse moves over element

### Keyboard Events
- \`keydown\` - Key is pressed down
- \`keyup\` - Key is released
- \`keypress\` - Key is pressed (deprecated)

### Form Events
- \`submit\` - Form is submitted
- \`change\` - Input value changes
- \`input\` - Input value changes (real-time)
- \`focus\` - Element gains focus
- \`blur\` - Element loses focus

### Window Events
- \`load\` - Page finishes loading
- \`resize\` - Window is resized
- \`scroll\` - Page is scrolled

## Event Object

Event handlers receive an event object with useful information:

\`\`\`javascript
button.addEventListener('click', function(event) {
  console.log('Event type:', event.type);
  console.log('Target element:', event.target);
  console.log('Mouse position:', event.clientX, event.clientY);
  
  // Prevent default behavior
  event.preventDefault();
  
  // Stop event from bubbling up
  event.stopPropagation();
});
\`\`\`

## Event Delegation

Handle events on parent elements instead of individual children:

\`\`\`javascript
const list = document.querySelector('#todo-list');

list.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-btn')) {
    // Handle delete button click
    event.target.parentElement.remove();
  }
  
  if (event.target.classList.contains('edit-btn')) {
    // Handle edit button click
    console.log('Edit clicked');
  }
});
\`\`\`

## Form Handling

\`\`\`javascript
const form = document.querySelector('#contact-form');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission
  
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  
  // Validate
  if (!name || !email) {
    alert('Please fill all fields');
    return;
  }
  
  // Process form data
  console.log('Name:', name);
  console.log('Email:', email);
});
\`\`\`

## Removing Event Listeners

\`\`\`javascript
function handleClick() {
  console.log('Clicked!');
}

// Add listener
button.addEventListener('click', handleClick);

// Remove listener (must use same function reference)
button.removeEventListener('click', handleClick);
\`\`\`
            `,
            exercise: {
              id: 'todo-app-exercise',
              title: 'Build a Simple Todo App',
              description: 'Create a todo app with add, delete, and toggle functionality using DOM manipulation and events.',
              starterCode: `// HTML structure (already created)
document.body.innerHTML = \`
  <div class="todo-app">
    <h1>Todo App</h1>
    <form id="todo-form">
      <input type="text" id="todo-input" placeholder="Enter a todo..." required>
      <button type="submit">Add Todo</button>
    </form>
    <ul id="todo-list"></ul>
  </div>
\`;

// Your JavaScript code here
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Add your event listeners and functions here
// 1. Handle form submission to add new todos
// 2. Handle clicking on todos to toggle completion
// 3. Handle delete button clicks to remove todos

function addTodo(text) {
  // Create todo item with delete button
  // Add to the list
}

function toggleTodo(todoItem) {
  // Toggle completed class/style
}

function deleteTodo(todoItem) {
  // Remove from list
}`,
              solution: `const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const text = input.value.trim();
  if (text) {
    addTodo(text);
    input.value = '';
  }
});

todoList.addEventListener('click', function(event) {
  const todoItem = event.target.closest('li');
  
  if (event.target.classList.contains('delete-btn')) {
    deleteTodo(todoItem);
  } else if (event.target.classList.contains('todo-text')) {
    toggleTodo(todoItem);
  }
});

function addTodo(text) {
  const li = document.createElement('li');
  li.innerHTML = \`
    <span class="todo-text">\${text}</span>
    <button class="delete-btn">Delete</button>
  \`;
  li.style.padding = '10px';
  li.style.margin = '5px 0';
  li.style.backgroundColor = '#f0f0f0';
  li.style.borderRadius = '5px';
  li.style.display = 'flex';
  li.style.justifyContent = 'space-between';
  li.style.alignItems = 'center';
  
  const deleteBtn = li.querySelector('.delete-btn');
  deleteBtn.style.backgroundColor = 'red';
  deleteBtn.style.color = 'white';
  deleteBtn.style.border = 'none';
  deleteBtn.style.padding = '5px 10px';
  deleteBtn.style.borderRadius = '3px';
  deleteBtn.style.cursor = 'pointer';
  
  const todoText = li.querySelector('.todo-text');
  todoText.style.cursor = 'pointer';
  
  todoList.appendChild(li);
}

function toggleTodo(todoItem) {
  const todoText = todoItem.querySelector('.todo-text');
  if (todoItem.classList.contains('completed')) {
    todoItem.classList.remove('completed');
    todoText.style.textDecoration = 'none';
    todoItem.style.opacity = '1';
  } else {
    todoItem.classList.add('completed');
    todoText.style.textDecoration = 'line-through';
    todoItem.style.opacity = '0.6';
  }
}

function deleteTodo(todoItem) {
  todoItem.remove();
}`,
              tests: [
                'document.getElementById("todo-form") !== null',
                'document.getElementById("todo-list") !== null'
              ],
              hints: [
                'Use event.preventDefault() to stop form submission',
                'Use event delegation on the todo list for efficiency',
                'Create todo items with both text and delete button',
                'Use classList.toggle() or manual class management for completion state'
              ]
            }
          }
        ]
      }
    ]
  }
};

export const getCourseContent = (courseId: string) => {
  return courseContent[courseId as keyof typeof courseContent] || null;
};