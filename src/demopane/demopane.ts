import { insertText } from '../taskpane/taskpane';
import {getDemoContent } from '../demopane/demoContent';


document.addEventListener('DOMContentLoaded', (event) => {
//Dropdown
const dropdown = document.getElementById('avdeling') as HTMLSelectElement;
const selectedValue = dropdown.value;

//Checkbox
const checkbox = document.getElementById('myCheckbox') as HTMLInputElement;
const isChecked = checkbox.checked;

// Text box
const textBox = document.getElementById('lønn') as HTMLInputElement;
const textValue = textBox.value;


// Create a new button element
const button = document.createElement('button');

// Set the button text
button.textContent = 'Generate Document';

// Add an event listener to the button
button.addEventListener('click', () => {
  // This code will run when the button is clicked
  insertText(getDemoContent(selectedValue, textValue, isChecked));
});

// Add the button to the body of the document
document.body.appendChild(button);


});

