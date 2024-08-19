/**
 * Function to get the selected radio button value.
 * @param container HTML element containing the radio buttons
 * @param radioName Name of the radio button group
 * @param valueToCheck Value to check against the selected value
 * @returns true if the selected value is equal to valueToCheck, otherwise false
 */
export function checkSelectedRadioButtonValue(container: HTMLElement, radioName: string, valueToCheck: string) {
    const radios = Array.from(container.querySelectorAll(`input[name="${radioName}"]`));
    let selectedValue;
    for (const radio of radios) {
        if ((radio as HTMLInputElement).checked) {
            selectedValue = (radio as HTMLInputElement).value;
            break;
        }
    }
    if (selectedValue === valueToCheck) {
        return true;
    } else {return false;}
}
/**
 * Get the value of the selected radio button.
 * @param container HTML element containing the radio buttons
 * @param radioName Radio button group name
 * @returns Selected radio button value as a string
 */
export function getSelectedRadioButtonValue(container: HTMLElement, radioName: string) {
    const radios = Array.from(container.querySelectorAll(`input[name="${radioName}"]`));
    let selectedValue;
    for (const radio of radios) {
        if ((radio as HTMLInputElement).checked) {
            selectedValue = (radio as HTMLInputElement).value;
            break;
        }
    }
    return selectedValue as string;
  }

export function uncheckAllRadioButtons(container: HTMLElement, radioName: string) {
    const radios = Array.from(container.querySelectorAll(`input[name="${radioName}"]`));
    for (const radio of radios) {
        (radio as HTMLInputElement).checked = false;
    }
}