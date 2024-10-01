import { insertText } from "../taskpane/taskpane";

/**
 * Generates a dynamic pane with a form based on the provided HTML content.
 * The form contains text boxes for each variable name found in the HTML content.
 * 
 * @param {string} htmlContent - The HTML content containing variable names.
 */
export function createDynamicPane(htmlContent: string, paneTitle?: string): void {
    const container = document.getElementById('dynamic-pane-container');
    if (!container) {
        console.error('Container with id "dynamic-pane-container" not found.');
        return;
    }

    // Clear the container's existing content
    container.innerHTML = '';

    // If paneTitle is provided, update the existing header or create a new one
    if (paneTitle) {
        let header = document.getElementById('paneTitle') as HTMLElement;
        if (!header) {
            header = document.createElement('h3');
            header.id = 'paneTitle';
            container.appendChild(header);
        }
        header.textContent = paneTitle;
    }

    const { form } = parseContent(htmlContent);


    // Append the form to the container
    container.appendChild(form);

    // Create a button to reset the
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.className = 'btn btn-secondary'; // Add Bootstrap classes
    resetButton.addEventListener('click', () => {
        form.reset();
    });

    // Create a button to generate text
    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate Text';
    generateButton.className = 'btn btn-primary'; // Add Bootstrap classes
    generateButton.addEventListener('click', () => {
        // Collect input values from the form
        const formData = new FormData(form);
        let updatedContent = htmlContent;
        formData.forEach((value, key) => {
            const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
            updatedContent = updatedContent.replace(regex, value.toString());
        });

        // Update HTML-tags to match Word's default styles
        updatedContent = updatedContent.replace(/<p>/g, '<p class="MsoNormal">');
        updatedContent = updatedContent.replace(/<h1>/g, '<h1 class="h1">');
        updatedContent = updatedContent.replace(/<h2>/g, '<h2 class="h2">');
        updatedContent = updatedContent.replace(/<h3>/g, '<h3 class="h3">');


        // Insert the updated content into the document
        insertText(updatedContent, 'START', false);
    });

    // Create a wrapper div for the buttons
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'd-flex';
    
    // Add a div to wrap the reset button and push the generate button to the right
    const resetButtonWrapper = document.createElement('div');
    resetButtonWrapper.className = 'mr-auto';
    resetButtonWrapper.appendChild(resetButton);
    
    // Append the reset button wrapper and generate button to the button wrapper
    buttonWrapper.appendChild(resetButtonWrapper);
    buttonWrapper.appendChild(generateButton);
    
    // Append the wrapper to the container
    container.appendChild(buttonWrapper);

}

/**
 * Parses the HTML content to find variable placeholders and creates a form with input fields.
 * 
 * @param {string} content - The HTML content to be parsed.
 * @returns {object} - An object containing the form element and the modified content.
 */
function parseContent(content: string): { form: HTMLFormElement, modifiedContent: string } {
    console.log(content);
    const form = document.createElement('form');
    const variableRegex = /\$\{([^}]+)\}/g;
    let match;
    const processedVariables = new Set<string>();

    while ((match = variableRegex.exec(content)) !== null) {
        const variableName = match[1];
        if (processedVariables.has(variableName)) {
            continue; // Skip if the variable name has already been processed
        }
        processedVariables.add(variableName);
        console.log('Found variable:', variableName); // Log each variable name
        const decodedName = decodeURIComponent(variableName.replace(/-/g, ' '));

        const label = document.createElement('label');
        label.htmlFor = variableName;
        label.textContent = decodedName;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = variableName;
        input.name = variableName;
        input.className = 'form-control';

        const inputContainer = document.createElement('div');
        inputContainer.className = 'form-group';
        inputContainer.appendChild(label); // Append the label first
        inputContainer.appendChild(input); // Append the input field second

        // Debugging: Check if inputContainer is created correctly
        console.log('Input container created:', inputContainer);

        form.appendChild(inputContainer);
    }

    const modifiedContent = content.replace(variableRegex, (match, variableName) => {
        return `<div class="form-group"><label for="${variableName}">${decodeURIComponent(variableName.replace(/-/g, ' '))}</label><input type="text" class="form-control" id="${variableName}" name="${variableName}"></div>`;
    });

    return { form, modifiedContent };
}