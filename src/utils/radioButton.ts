export function getSelectedRadioButtonValue(container: HTMLElement, radioName: string, valueToCheck: string) {
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

export function uncheckAllRadioButtons(container: HTMLElement, radioName: string) {
    const radios = Array.from(container.querySelectorAll(`input[name="${radioName}"]`));
    for (const radio of radios) {
        (radio as HTMLInputElement).checked = false;
    }
}