import { insertText } from "../taskpane/taskpane";
import { newPane } from "../taskpane/taskpane";
import { addToDropDown, updateDropDownFromExcel } from "../utils/readExcel";
import { combineHtmlStrings } from "../utils/combineHTML";
import * as radioButtonUtils from "../utils/radioButton";
import { fetchOrgUnits, getChildren } from "../utils/getOrgReg";
import { getTilbudsbrev } from "./htmlText";



type PositionCode = {
  SKO: string;
  Norsk: string;
  Engelsk: string;
  norJobTitle: string;
  engJobTitle: string;
  Kategori: string;
  Undervisning: string;
  InUse: number;
};

interface OrgUnit {
  ouId: number;
  name: {
    eng?: string;
    nob?: string;
    nno?: string;
  };
  children: number[];
}


// Modified function to filter and update the dropdown based on a specified column to search
function filterAndUpdateDropdown(AllPositionCodes: PositionCode[], searchTerm: string, selectElement: HTMLSelectElement, searchColumn: keyof PositionCode): void {
  let filteredPositionCodes = AllPositionCodes.filter(code => code[searchColumn].toString().includes(searchTerm));
  updateDropDownFromExcel(selectElement, filteredPositionCodes);
}

// Function to reset the dropdown
function resetDropdown(AllPositionCodes: PositionCode[], selectElement: HTMLSelectElement): void {
  updateDropDownFromExcel(selectElement, AllPositionCodes);
}

function getPositionDetail(positionCodesElement: any, checkString: string, returnType: number, isEnglish: boolean) {
  const positionDetails = positionCodesElement.find((c: any) => c.Norsk === checkString) || null;

  if (positionDetails) {
    if (returnType === 0) {
      return (isEnglish && positionDetails['Engelsk'] !== undefined)
        ? positionDetails['Norsk'] + ` (${positionDetails['Engelsk stillingsbetegnelse']})`
        : positionDetails['Norsk'];
    }
    else if (returnType === 1) {
      const englishTitle = positionDetails['Engelsk stillingsbetegnelse'];
      const norwegianTitle = positionDetails['Norsk stillingsbetegnelse'];
      if (isEnglish && englishTitle !== undefined && englishTitle !== '') {
        return englishTitle;
      }
      return norwegianTitle;
    } else if (returnType === 2) {
      return positionDetails['Kategori'];
    }
    else if (returnType === 3) {
      return positionDetails['Undervisning'];
    }
  }

  return null;
}

// Function to populate dropdown with OrgUnit names
function populateDropdown(dropdown: HTMLSelectElement, units: OrgUnit[], includeBlank: boolean = true) {
  dropdown.innerHTML = "";
  if (includeBlank) {
    const blankOption = document.createElement("option");
    blankOption.value = "";
    blankOption.text = "";
    dropdown.appendChild(blankOption);
  }
  units.forEach((unit) => {
    if (unit.name.nob) {
      const option = document.createElement("option");
      option.value = JSON.stringify(unit); // Use JSON string of the OrgUnit as the value
      option.text = unit.name.nob;
      dropdown.appendChild(option);
    }
  });
}


export async function initializeTilbudsbrevpane() {

  // Fetch and cache organizational units
  await fetchOrgUnits();

  // Buttons
  const tilbakeButton: HTMLButtonElement | null = document.getElementById("tilbake") as HTMLButtonElement;
  const generateTextButton: HTMLButtonElement | null = document.getElementById("generateDocument") as HTMLButtonElement;
  const resetButton: HTMLButtonElement | null = document.getElementById("resetButton") as HTMLButtonElement;

  //Groups
  const employeeTypeRadioGroup: HTMLElement | null = document.getElementById("employeeTypeRadioGroup") as HTMLElement;
  const forbeholdsGroup: HTMLElement | null = document.getElementById("datoForbeholdGroup") as HTMLElement;
  const externallyFundedGroup: HTMLElement | null = document.getElementById("externallyFundedGroup") as HTMLElement;
  const noBankIdGroup: HTMLElement | null = document.getElementById("noBankIdGroup") as HTMLElement;
  const educationCompetenceGroup: HTMLElement | null = document.getElementById("educationCompetenceGroup") as HTMLElement;
  const seksjonGroup: HTMLElement | null = document.getElementById("seksjonGroup") as HTMLElement;
  const tempYearsGroup: HTMLElement | null = document.getElementById("tempYearsGroup") as HTMLElement;
  const careerPromotingWorkGroup: HTMLElement | null = document.getElementById("careerPromotingWorkGroup") as HTMLElement;

  // Fields
  const tempYears: HTMLInputElement | null = document.getElementById("tempYears") as HTMLInputElement;
  const engelsk: HTMLInputElement | null = document.getElementById("engelsk") as HTMLInputElement;
  const externallyFunded: HTMLInputElement | null = document.getElementById("externallyFunded") as HTMLInputElement;
  const needsNorwegianCompetence: HTMLInputElement | null = document.getElementById("needsNorwegianCompetence") as HTMLInputElement;
  const relocateToNorway: HTMLInputElement | null = document.getElementById("relocateToNorway") as HTMLInputElement;
  const eksportlisens: HTMLInputElement | null = document.getElementById("eksportlisens") as HTMLInputElement;
  const oppholdstillatelse: HTMLInputElement | null = document.getElementById("oppholdstillatelse") as HTMLInputElement;
  const noBankID: HTMLInputElement | null = document.getElementById("bankID") as HTMLInputElement;
  const datoForbehold: HTMLInputElement | null = document.getElementById("datoForbehold") as HTMLInputElement;
  const avdeling: HTMLSelectElement | null = document.getElementById("avdeling") as HTMLSelectElement;
  const seksjon: HTMLSelectElement | null = document.getElementById("seksjon") as HTMLSelectElement;
  const allCodes: HTMLInputElement | null = document.getElementById("allCodes") as HTMLInputElement;
  const positionCode: HTMLSelectElement | null = document.getElementById("positionCode") as HTMLSelectElement;
  const careerPromotingWork: HTMLInputElement | null = document.getElementById("careerPromotingWork") as HTMLInputElement;
  const noEducationCompetence: HTMLInputElement | null = document.getElementById("educationCompetence") as HTMLInputElement;
  const percentageWork: HTMLInputElement | null = document.getElementById("percentageWork") as HTMLInputElement;
  const annualSalary: HTMLInputElement | null = document.getElementById("annualSalary") as HTMLInputElement;
  const externallyFundedProjectName: HTMLInputElement | null = document.getElementById("externallyFundedProjectName") as HTMLInputElement;
  const answerByDate: HTMLInputElement | null = document.getElementById("answerByDate") as HTMLInputElement;
  const answerEmail: HTMLInputElement | null = document.getElementById("answerEmail") as HTMLInputElement;
  const contactLocalName: HTMLInputElement | null = document.getElementById("contactLocalName") as HTMLInputElement;
  const contactLocalEmail: HTMLInputElement | null = document.getElementById("contactLocalEmail") as HTMLInputElement;
  const contactHrName: HTMLInputElement | null = document.getElementById("contactHrName") as HTMLInputElement;
  const contactHrEmail: HTMLInputElement | null = document.getElementById("contactHrEmail") as HTMLInputElement;

  // Ref to position codes
  const AllPositionCodes: PositionCode[] = await addToDropDown('assets\\stillingskoder.xlsx', 'positionCode');

  // Variables
  let selectedEmployeeType = 'Fast';
  let skoTitle = "" as string;
  let jobTitle = "" as string; // Not in use, but might be usefull?
  let teachingPos = false as boolean;


  // TODO: REMOVE ME WHEN NORSK IS ADDED
  engelsk?.addEventListener('change', () => {
    engelsk.checked = true;
  });

  // Populate avdeling dropdown on load
  getChildren(1).then((children) => {
    populateDropdown(avdeling, children);
  }).catch((error) => {
    console.error("Error fetching children:", error);
  });


  avdeling?.addEventListener("change", async () => {
    const selectedOption = avdeling.options[avdeling.selectedIndex];
    const selectedJson = selectedOption.value;
    if (selectedJson === ""){
      seksjonGroup.style.display = "none";
        seksjon.value = "";
        return;
    }
    const selectedOrgUnit = JSON.parse(selectedJson); // Parse the JSON string

    const ouId = selectedOrgUnit.ouId; // Extract the ouId

    seksjon.innerHTML = "";
    if (seksjonGroup) {
      const children: OrgUnit[] = await getChildren(parseInt(ouId));

      if (children.length > 0) {
        seksjonGroup.style.display = "block";
        seksjon.value = "";
        // Add a blank option at the top
        const blankOption = document.createElement("option");
        blankOption.value = "";
        blankOption.text = "";
        seksjon.appendChild(blankOption);

        // Populate the seksjon dropdown with OrgUnit objects
        children.forEach((child) => {
          if (child.name.nob) {
            const option = document.createElement("option");
            option.value = JSON.stringify(child); // Set the value to the JSON string of the OrgUnit
            option.text = child.name.nob;
            seksjon.appendChild(option);
          }
        });
      }
      else {
        seksjonGroup.style.display = "none";
        seksjon.value = "";
        return;
      }
    }
  });

  
  // Add event listener to employeeType radio buttons
  const employeeTypeRadios = document.querySelectorAll('input[name="employeeType"]');
  employeeTypeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      selectedEmployeeType = (document.querySelector('input[name="employeeType"]:checked') as HTMLInputElement).value;
      if (selectedEmployeeType === 'Fast') {
        tempYearsGroup.style.display = "none";
        tempYears.value = "";
      }
      else {
        tempYearsGroup.style.display = "block";
      }
    });
    ;
  });


  // Add event listener to positionCodeDropdown
  positionCode?.addEventListener("mousedown", () => {
    if (allCodes.checked) {
      resetDropdown(AllPositionCodes, positionCode);
    } else {
      filterAndUpdateDropdown(AllPositionCodes, "1", positionCode, "InUse");
    }
  });


  positionCode?.addEventListener("change", async () => {
    // Get the selected position code and corresponding data
    const selectedPositionCode = positionCode.value;
    skoTitle = getPositionDetail(AllPositionCodes, selectedPositionCode, 0, engelsk.checked).substring(0, 4);
    jobTitle = getPositionDetail(AllPositionCodes, selectedPositionCode, 1, engelsk.checked);
    console.log(`Title: `+jobTitle);
    teachingPos = getPositionDetail(AllPositionCodes, selectedPositionCode, 3, engelsk.checked) === '1' ? true : false;

    if (teachingPos) {
      educationCompetenceGroup.style.display = "block";
    }
    else {
      educationCompetenceGroup.style.display = "none";
      noEducationCompetence.checked = false;
    }

    const careerPromotingWorkLabel = document.querySelector('#careerPromotingWorkGroup label');

    if (careerPromotingWorkLabel) {
      if (skoTitle === "1017") {
        careerPromotingWorkGroup.style.display = "block";
        careerPromotingWorkLabel.textContent = "Mengde karrierefremmende arbeid (%)";
        careerPromotingWork.value = '25';
      } else if (skoTitle === "1352") {
        careerPromotingWorkGroup.style.display = "block";
        careerPromotingWorkLabel.textContent = "Mengde karrierefremmende arbeid (mnd)";
        careerPromotingWork.value = '0';
      } else {
        careerPromotingWorkGroup.style.display = "none";
        careerPromotingWork.value = '0';
        careerPromotingWorkLabel.textContent = "Mengde karrierefremmende arbeid";
      }
    }
  });

  // Add event listeners eksportlisens
  eksportlisens.addEventListener('change', () => {
    if (eksportlisens.checked || oppholdstillatelse.checked) {
      forbeholdsGroup.style.display = "block";
    }
    else {
      forbeholdsGroup.style.display = "none";
      datoForbehold.value = "";
    }
  });

  // Add event listeners oppholdstillatelse
  oppholdstillatelse.addEventListener('change', () => {
    if (eksportlisens.checked || oppholdstillatelse.checked) {
      forbeholdsGroup.style.display = "block";
    }
    else {
      forbeholdsGroup.style.display = "none";
      datoForbehold.value = "";
    }
  });

  // Add event listeners externallyFunded
  externallyFunded.addEventListener('change', () => {
    if (externallyFunded.checked) {
      externallyFundedGroup.style.display = "block";
    }
    else {
      externallyFundedGroup.style.display = "none";
      externallyFundedProjectName.value = "";
    }
  });

  // Add event listeners bankID
  noBankID.addEventListener('change', () => {
    if (noBankID.checked) {
      noBankIdGroup.style.display = "block";
    }
    else {
      noBankIdGroup.style.display = "none";
      answerByDate.value = "";
      answerEmail.value = "";
    }
  });



  // back button
  if (tilbakeButton) {
    tilbakeButton.addEventListener('click', () => {
      newPane();
    });
  };

  // Reset button
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      newPane('tilbudsbrev'); //this just calls the pane again, I believe it should reset?
    });
  }

  //Button to add text to the document
  if (generateTextButton) {
    generateTextButton.addEventListener("click", () => {

      let usedPosTitle = getPositionDetail(AllPositionCodes, positionCode.value, 1, !engelsk.checked);;
      if (engelsk.checked) {
        usedPosTitle = getPositionDetail(AllPositionCodes, positionCode.value, 1, engelsk.checked);
      }

      insertText(getTilbudsbrev(engelsk.checked, selectedEmployeeType, externallyFunded.checked, needsNorwegianCompetence.checked, relocateToNorway.checked,
        eksportlisens.checked, oppholdstillatelse.checked, noBankID.checked, tempYears.value, datoForbehold.value, avdeling.value, seksjon.value,
        skoTitle, usedPosTitle, noEducationCompetence.checked, careerPromotingWork.value, percentageWork.value, externallyFundedProjectName.value,
        annualSalary.value, answerByDate.value, answerEmail.value, contactLocalName.value, contactLocalEmail.value, contactHrName.value,
        contactHrEmail.value), 'START');
    });
  }



}