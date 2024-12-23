/* eslint-disable no-undef */
import { insertText } from "../taskpane/taskpane";
import { newPane } from "../taskpane/taskpane";
import { getArbeidsavtaleHeading } from "./htmlHeader";
import { getArbeidsavtale } from "./htmlBody";
import { addToDropDown, updateDropDownFromExcel } from "../utils/readExcel";
import { combineHtmlStrings } from "../utils/combineHTML";
import * as radioButtonUtils from "../utils/radioButton";
import { getArbeidsavtaleFooter } from "./htmlFooter";

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

/**
 * Get job title or category from a position code.
 * @param positionCodesElement Element from the positionCodes array
 * @param checkString String to check for
 * @param returnType 0 to return english SKO with title, 1 to return jobTitle, 2 to return category, 3 for teachingposition boolean
 * @param isEnglish Boolean to specify whether to return the Norwegian or English job title
 * @returns Job title, category, teachingpos, depending on returnType
 */
function getPositionDetail(positionCodesElement: any, checkString: string, returnType: number, isEnglish: boolean) {
  const positionDetails = positionCodesElement.find((c: any) => c.Norsk === checkString) || null;


  if (positionDetails) {
    if (returnType === 0) {
      return (isEnglish && positionDetails['Engelsk'] !== undefined)
        ? positionDetails['Norsk'] + ` (${positionDetails['Engelsk stillingsbetegnelse']})`
        : positionDetails['Norsk'];
    }
    else if (returnType === 1) {
      if (positionDetails['Engelsk stillingsbetegnelse'] === undefined && isEnglish) {
        return "";
      }
      return (isEnglish && positionDetails['Engelsk'] !== undefined)
        ? positionDetails['Engelsk stillingsbetegnelse'].toLowerCase()
        : positionDetails['Norsk stillingsbetegnelse'].toLowerCase();

    } else if (returnType === 2) {
      return positionDetails['Kategori'];
    }
    else if (returnType === 3) {
      return positionDetails['Undervisning'];
    }
  }

  return null;
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

function removeTrailingSpacesAndPeriods(input: string): string {
  return input.replace(/[. ]+$/, '');
}

// Function to convert ISO date to dd.mm.yyyy format
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  return isoDate; // Return the original value if the date is invalid
}

/**
 * Initializes the arbeidsavtalepane by adding event listeners to the input fields and checkboxes.
 */
export async function initializeArbeidsavtalepane() {

  // Input elements
  let mscaSupervisor: HTMLInputElement | null = document.getElementById("mscaSupervisor") as HTMLInputElement;
  let mscaSupervisorText: HTMLInputElement | null = document.getElementById("mscaSupervisorText") as HTMLInputElement;
  let engelsk: HTMLInputElement | null = document.getElementById("engelsk") as HTMLInputElement;
  let mobilityAndFamilyAllowanceBox: HTMLInputElement | null = document.getElementById("mobilityFamilyAllowanceBox") as HTMLInputElement;
  let mscaBox: HTMLInputElement | null = document.getElementById("MSCA") as HTMLInputElement;
  let abroadEmployee: HTMLInputElement | null = document.getElementById("abroadEmployee") as HTMLInputElement;
  let additionalDutyBox: HTMLInputElement | null = document.getElementById("additionalDuty") as HTMLInputElement;
  let additionalDutyText: HTMLInputElement | null = document.getElementById("additionalDutyText") as HTMLInputElement;
  let externallyFundedBox: HTMLInputElement | null = document.getElementById("externallyFunded") as HTMLInputElement;
  let externallyFundedProjectName: HTMLInputElement | null = document.getElementById("externallyFundedProjectName") as HTMLInputElement;
  let externallyFundedEndDate: HTMLInputElement | null = document.getElementById("externallyFundedEndDate") as HTMLInputElement;
  let externallyFundedTasks: HTMLInputElement | null = document.getElementById("externallyFundedTasks") as HTMLInputElement;
  let employee: HTMLInputElement | null = document.getElementById("employee") as HTMLInputElement;
  let tempEmployee: HTMLInputElement | null = document.getElementById("tempEmployee") as HTMLInputElement;
  let substituteEmployee: HTMLInputElement | null = document.getElementById("substituteEmployee") as HTMLInputElement;
  let termEmployee: HTMLInputElement | null = document.getElementById("termEmployee") as HTMLInputElement;
  let researchFellow: HTMLInputElement | null = document.getElementById("researchFellow") as HTMLInputElement;
  let artisticFellow: HTMLInputElement | null = document.getElementById("artisticFellow") as HTMLInputElement;
  let postdoktor: HTMLInputElement | null = document.getElementById("postdoc") as HTMLInputElement;
  let scientificAssistant: HTMLInputElement | null = document.getElementById("scientificAssistant") as HTMLInputElement;
  let nameElement: HTMLInputElement | null = document.getElementById("name") as HTMLInputElement;
  let personalIdElement: HTMLInputElement | null = document.getElementById("personalId") as HTMLInputElement;
  let placeOfWorkElement: HTMLInputElement | null = document.getElementById("placeOfWork") as HTMLInputElement;
  let percentageFullTimeElement: HTMLInputElement | null = document.getElementById("percentageWork") as HTMLInputElement;
  let seniorityElement: HTMLInputElement | null = document.getElementById("seniority") as HTMLInputElement;
  let annualSalaryElement: HTMLInputElement | null = document.getElementById("annualSalary") as HTMLInputElement;
  let startingDateElement: HTMLInputElement | null = document.getElementById("startingDate") as HTMLInputElement;
  let endDateElement: HTMLInputElement | null = document.getElementById("endDate") as HTMLInputElement;
  let mobilityAllowanceElement: HTMLInputElement | null = document.getElementById("mobilityAllowance") as HTMLInputElement;
  let workDescriptionElement: HTMLInputElement | null = document.getElementById("workDescription") as HTMLInputElement;
  let workDescriptionText: HTMLInputElement | null = document.getElementById("workDescriptionText") as HTMLInputElement;
  let familyAllowanceElement: HTMLInputElement | null = document.getElementById("familyAllowance") as HTMLInputElement;
  let mandatoryWork: HTMLInputElement | null = document.getElementById("mandatoryWork") as HTMLInputElement;
  let mandatoryWorkAmountText: HTMLInputElement | null = document.getElementById("mandatoryWorkAmountText") as HTMLInputElement;
  let substituteAdvertised: HTMLInputElement | null = document.getElementById("substituteAdvertised") as HTMLInputElement;
  let substituteForGroup: HTMLInputElement | null = document.getElementById("substiuteForGroup") as HTMLInputElement;
  let substituteFor: HTMLInputElement | null = document.getElementById("substituteFor") as HTMLInputElement;
  let abroardEmployeeText: HTMLInputElement | null = document.getElementById("abroardEmployeeText") as HTMLInputElement;
  let allCodes: HTMLInputElement | null = document.getElementById("allCodes") as HTMLInputElement;
  let tempTeachNeed: HTMLInputElement | null = document.getElementById("tempTeachNeed") as HTMLInputElement;
  let doubleCompetence: HTMLInputElement | null = document.getElementById("doubleCompetence") as HTMLInputElement;
  let namePos: HTMLInputElement | null = document.getElementById("namePos") as HTMLInputElement;
  let nameSign: HTMLInputElement | null = document.getElementById("nameSign") as HTMLInputElement;
  let mscaInput: HTMLInputElement | null = document.getElementById("mscaInput") as HTMLInputElement;
  let frameProgramme: HTMLInputElement | null = document.getElementById("frameProgram") as HTMLInputElement;
  let grantNumb: HTMLInputElement | null = document.getElementById("grantNumb") as HTMLInputElement;
  let familyAllowanceMonths: HTMLInputElement | null = document.getElementById("familyAllowanceMonths") as HTMLInputElement;
  let mobilityAllowanceMonths: HTMLInputElement | null = document.getElementById("mobilityAllowanceMonths") as HTMLInputElement;

  // Select elements
  let positionCodeSelect: HTMLSelectElement | null = document.getElementById("positionCode") as HTMLSelectElement;

  // Elements
  let tempTeachNeedGroup: HTMLElement | null = document.getElementById("tempTeachNeedGroup") as HTMLElement;
  let additionalDutyGroup: HTMLElement | null = document.getElementById("additionalDutyGroup") as HTMLElement;
  let additionalDutyRadio: HTMLElement | null = document.getElementById("additionalDuty") as HTMLElement;
  let externallyFundedGroup: HTMLElement | null = document.getElementById("externallyFundedGroup") as HTMLElement;
  let termOptionsGroup: HTMLElement | null = document.getElementById("termType") as HTMLElement;
  let familyAllowanceGroup: HTMLElement | null = document.getElementById("familyAllowanceGroup") as HTMLElement;
  let mobilityAllowanceGroup: HTMLElement | null = document.getElementById("mobilityAllowanceGroup") as HTMLElement;
  let endDateGroup: HTMLElement | null = document.getElementById("endDateGroup") as HTMLElement;
  let mandatoryWorkAmount: HTMLElement | null = document.getElementById("mandatoryWorkAmount") as HTMLElement;
  let educationalCompetence: HTMLElement | null = document.getElementById("educationalCompetence") as HTMLElement;
  let norwegianCompetence: HTMLElement | null = document.getElementById("norwegianCompetence") as HTMLElement;
  let substituteGroup: HTMLElement | null = document.getElementById("substituteGroup") as HTMLElement;
  let substituteTypeGroup: HTMLElement | null = document.getElementById("substituteTypeGroup") as HTMLElement;
  let employeeTypeRadio: HTMLElement | null = document.getElementById("employeeTypeRadio") as HTMLElement;
  let abroardEmployeeTextGroup: HTMLElement | null = document.getElementById("abroardEmployeeTextGroup") as HTMLElement;


  // Button
  let tilbakeButton: HTMLButtonElement | null = document.getElementById("tilbake") as HTMLButtonElement;
  let generateTextButton: HTMLButtonElement | null = document.getElementById("generateDocument") as HTMLButtonElement;
  let resetButton: HTMLButtonElement | null = document.getElementById("resetButton") as HTMLButtonElement;

  // Variables
  let externallyFoundedResearcher = false as boolean;
  let skoTitle = "" as string;
  let jobTitle = "" as string; // Not in use, but might be usefull?
  let category = "" as string; // Not in use, but might be usefull?
  let employeeType = "fast" as string;
  let teachingPos = false as boolean;
  let substituteTypeGroupValue = "" as string;
  let mscaArbeidsgiveravgift = 1.141 as number;
  const AllPositionCodes: PositionCode[] = await addToDropDown('assets\\stillingskoder.xlsx', 'positionCode');

  positionCodeSelect?.addEventListener("mousedown", () => {
    if (scientificAssistant.checked) {
      filterAndUpdateDropdown(AllPositionCodes, "Vitenskapelig", positionCodeSelect, "Norsk");
    }
    else if (allCodes.checked) {
      resetDropdown(AllPositionCodes, positionCodeSelect);
    }
    else {
      filterAndUpdateDropdown(AllPositionCodes, "1", positionCodeSelect, "InUse");
    }
  });

  positionCodeSelect?.addEventListener("change", async () => {
    // Get the selected position code and corresponding data
    const selectedPositionCode = positionCodeSelect.value;
    skoTitle = getPositionDetail(AllPositionCodes, selectedPositionCode, 0, engelsk.checked);
    jobTitle = getPositionDetail(AllPositionCodes, selectedPositionCode, 1, engelsk.checked);
    category = getPositionDetail(AllPositionCodes, selectedPositionCode, 2, engelsk.checked);
    teachingPos = getPositionDetail(AllPositionCodes, selectedPositionCode, 3, engelsk.checked) === '1' ? true : false;

    if (teachingPos && tempEmployee.checked) {
      tempTeachNeedGroup.style.display = "block";
    } else {
      tempTeachNeedGroup.style.display = "none";
      tempTeachNeed.checked = false;
    }

    // Handles no english translation of jobTitle
    if (jobTitle === "" && engelsk.checked) {
      skoTitle = getPositionDetail(AllPositionCodes, selectedPositionCode, 0, !engelsk.checked);
      jobTitle = getPositionDetail(AllPositionCodes, selectedPositionCode, 1, !engelsk.checked);
    }
    if (employee.checked && category === "V") {
      norwegianCompetence.style.display = "block";
    }
    else {
      norwegianCompetence.style.display = "none";
      radioButtonUtils.uncheckAllRadioButtons(norwegianCompetence, "norwegianCompetence");
    }

    if (teachingPos && employee) {
      educationalCompetence.style.display = "block";
      norwegianCompetence.style.display = "block";
    } else {
      educationalCompetence.style.display = "none";
      radioButtonUtils.uncheckAllRadioButtons(educationalCompetence, "educationalCompetence");
      norwegianCompetence.style.display = "none";
      radioButtonUtils.uncheckAllRadioButtons(norwegianCompetence, "norwegianCompetence");
    }

    if (mscaBox.checked && (positionCodeSelect.value.includes("Forsker") ||
      positionCodeSelect.value.includes("Stipendiat") ||
      positionCodeSelect.value.includes("Postdoktor"))) {
      mscaSupervisor.style.display = "block";
    }
    else {
      mscaSupervisor.style.display = "none"
      mscaSupervisorText.value = "";
    }

  });

  // Event listner for the externallyFunded box
  if (externallyFundedBox) {
    externallyFundedBox.addEventListener("change", () => {
      if (externallyFundedGroup) {
        externallyFundedGroup.style.display = externallyFundedBox.checked ? "block" : "none";
      }
    });
  }

  //Event listner for the mscaBox
  if (mscaBox)
    mscaBox.addEventListener("change", () => {
      mscaInput.style.display = mscaBox.checked ? "block" : "none";
      mobilityAllowanceElement.placeholder = mscaBox.checked ? "EUR" : "NOK";
      familyAllowanceElement.placeholder = mscaBox.checked ? "EUR" : "NOK";
      frameProgramme.value = "";
      grantNumb.value = "";

      if (mscaBox.checked && (positionCodeSelect.value.includes("Forsker") ||
        positionCodeSelect.value.includes("Stipendiat") ||
        positionCodeSelect.value.includes("Postdoktor"))) {
        mscaSupervisor.style.display = "block";
      }
      else {
        mscaSupervisor.style.display = "none"
        mscaSupervisorText.value = "";
      }
    });

  // Event listner for abroardEmployee
  if (abroadEmployee && abroardEmployeeTextGroup && abroardEmployeeText) {
    abroadEmployee.addEventListener("change", () => {
      if (abroadEmployee.checked) {
        abroardEmployeeTextGroup.style.display = "block";
      }
      else {
        abroardEmployeeTextGroup.style.display = "none";
        abroardEmployeeText.value = "";
      }
    });
  }

  // Code for when "Fast ansatt" is selected
  if (employee && endDateGroup) {
    employee.addEventListener("change", () => {
      employeeType = "fast";
      endDateGroup.style.display = "none";
      additionalDutyGroup.style.display = "none";
      substituteGroup.style.display = "none";
      termOptionsGroup.style.display = "none";
      workDescriptionElement.style.display = "none";
    });
  }

  // Code for when "Midlertidig" is selected
  if (tempEmployee && endDateGroup) {
    tempEmployee.addEventListener("change", () => {
      employeeType = "temp";
      endDateGroup.style.display = "block";
      workDescriptionElement.style.display = "block";
      norwegianCompetence.style.display = "none";
      additionalDutyGroup.style.display = "none";
      substituteGroup.style.display = "none";
      termOptionsGroup.style.display = "none";
      norwegianCompetence.style.display = "none";
      educationalCompetence.style.display = "none";
      radioButtonUtils.uncheckAllRadioButtons(educationalCompetence, "educationalCompetence");
    });
  }

  // Code for when "Vikar" is selected
  if (substituteEmployee && endDateGroup) {
    substituteEmployee.addEventListener("change", () => {
      employeeType = "sub";
      substituteGroup.style.display = "block";
      additionalDutyGroup.style.display = "none";
      workDescriptionText.style.display = "none";
      workDescriptionText.value = "";
      endDateGroup.style.display = "block";
      termOptionsGroup.style.display = "none";
      norwegianCompetence.style.display = "none";
      substituteTypeGroupValue = radioButtonUtils.getSelectedRadioButtonValue(substituteTypeGroup, "substitute");
      if (substituteTypeGroupValue === "person" || substituteTypeGroupValue === "many") {
        substituteForGroup.style.display = "block";
      } else {
        substituteForGroup.style.display = "none";
        substituteFor.value = "";
        substituteAdvertised.checked = false;
      }
    });
  }

  // Code for when "Åremål" is selected
  if (termEmployee && endDateGroup) {
    termEmployee.addEventListener("change", () => {
      employeeType = "term";
      termOptionsGroup.style.display = "block";
      norwegianCompetence.style.display = "none";
      endDateGroup.style.display = "block";
      substituteGroup.style.display = "none";
      workDescriptionElement.style.display = "none";
    });
  }

  //Event listner for karrierefremmende arbeid
  if (mandatoryWork) {
    mandatoryWork.addEventListener("change", () => {
      if (mandatoryWorkAmount) {
        mandatoryWorkAmount.style.display = mandatoryWork.checked ? "block" : "none";
      }
    });
  }

  //Event listener for the substituteTypeGroup (vikar)
  if (substituteTypeGroup && substituteForGroup) {
    substituteTypeGroup.addEventListener("change", () => {
      substituteTypeGroupValue = radioButtonUtils.getSelectedRadioButtonValue(substituteTypeGroup, "substitute");
      if (substituteTypeGroupValue === "person" || substituteTypeGroupValue === "many") {
        substituteForGroup.style.display = "block";
      } else {
        substituteForGroup.style.display = "none";
        substituteFor.value = "";
      }
    });
  }


  // Event listner for Research Fellow
  if (researchFellow) {
    researchFellow.addEventListener('click', () => {
      positionCodeSelect.value = "1017 - Stipendiat";
      jobTitle = getPositionDetail(AllPositionCodes, positionCodeSelect.value, 1, engelsk.checked);
      category = getPositionDetail(AllPositionCodes, positionCodeSelect.value, 2, engelsk.checked);
    });
  }

  if (additionalDutyRadio) {
    additionalDutyRadio.addEventListener('click', () => {
      if (additionalDutyText) {
        additionalDutyGroup.style.display = additionalDutyBox.checked ? "block" : "none";
      }
    }
    );
  }


  // Event listner for artisticFellow
  if (artisticFellow) {
    artisticFellow.addEventListener('click', () => {
      positionCodeSelect.value = "1017 - Stipendiat";
      jobTitle = getPositionDetail(AllPositionCodes, positionCodeSelect.value, 1, engelsk.checked);
      category = getPositionDetail(AllPositionCodes, positionCodeSelect.value, 2, engelsk.checked);
    });
  }
  // Event listner for postdoktor
  if (postdoktor) {
    postdoktor.addEventListener('click', () => {
      positionCodeSelect.value = "1352 - Postdoktor";
      jobTitle = getPositionDetail(AllPositionCodes, positionCodeSelect.value, 1, engelsk.checked);
      category = getPositionDetail(AllPositionCodes, positionCodeSelect.value, 2, engelsk.checked);
    });
  }

  // Event listeners for the mobilityAndFamilyAllowanceBox
  if (mobilityAndFamilyAllowanceBox) {
    mobilityAndFamilyAllowanceBox.addEventListener("change", () => {
      if (familyAllowanceGroup && mobilityAllowanceGroup) {
        familyAllowanceGroup.style.display = mobilityAndFamilyAllowanceBox.checked ? "block" : "none";
        mobilityAllowanceGroup.style.display = mobilityAndFamilyAllowanceBox.checked ? "block" : "none";
        mobilityAllowanceMonths.style.display = mobilityAndFamilyAllowanceBox.checked ? "block" : "none";
        familyAllowanceMonths.style.display = mobilityAndFamilyAllowanceBox.checked ? "block" : "none";
        mobilityAllowanceElement.value = "";
        familyAllowanceElement.value = "";
        mobilityAllowanceMonths.value = "";
        familyAllowanceMonths.value = "";

      }
    });
  }

  // Reset button
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      const hiddenFormGroups = document.querySelectorAll('.hidden-form-group') as NodeListOf<HTMLElement>;
      hiddenFormGroups.forEach(group => {
        group.style.display = 'none';
      });
    });
  }

  if (tilbakeButton) {
    tilbakeButton.addEventListener('click', () => {
      newPane();
    });
  };

  // Button logic
  if (generateTextButton) {
    generateTextButton.addEventListener("click", () => {
      if (
        !tempEmployee.checked &&
        externallyFundedBox.checked &&
        (jobTitle === "forsker" || jobTitle === "researcher")
      ) {
        externallyFoundedResearcher = true;
      } else {
        externallyFoundedResearcher = false;
      }

      let htmlHeaderText: string | null = null;
      let htmlBodyText: string | null = null;

      let mobAllowance = Math.round(Number(mobilityAllowanceElement.value) / mscaArbeidsgiveravgift);
      let famAllowance = Math.round(Number(familyAllowanceElement.value) / mscaArbeidsgiveravgift);
      let mobMonths = Number(mobilityAllowanceMonths.value);
      let famMonths = Number(familyAllowanceMonths.value);
      let mobility = mobAllowance != 0 ? true : false;
      let family = famAllowance != 0 ? true : false;
      workDescriptionText.value = removeTrailingSpacesAndPeriods(workDescriptionText.value);
      externallyFundedTasks.value = removeTrailingSpacesAndPeriods(externallyFundedTasks.value);

      htmlHeaderText = getArbeidsavtaleHeading(
        engelsk.checked,
        nameElement.value,
        personalIdElement.value,
        placeOfWorkElement.value,
        skoTitle,
        percentageFullTimeElement.value,
        seniorityElement.value,
        annualSalaryElement.value,
        mobAllowance,
        famAllowance,
        mobMonths,
        famMonths,
        formatDate(startingDateElement.value),
        formatDate(endDateElement.value),
        employeeType,
        mscaSupervisorText.value,
        mscaBox.checked,
      );

      htmlBodyText = getArbeidsavtale(
        engelsk.checked,
        tempEmployee.checked,
        substituteEmployee.checked,
        tempTeachNeed.checked,
        jobTitle,
        radioButtonUtils.checkSelectedRadioButtonValue(educationalCompetence, "educationalCompetence", "no"),
        radioButtonUtils.checkSelectedRadioButtonValue(norwegianCompetence, "norwegianCompetence", "no"),
        externallyFundedBox.checked,
        externallyFundedProjectName.value,
        externallyFundedEndDate.value,
        externallyFundedTasks.value,
        externallyFoundedResearcher,
        substituteAdvertised.checked,
        substituteTypeGroupValue,
        substituteFor.value,
        workDescriptionText.value,
        additionalDutyText.value,
        radioButtonUtils.getSelectedRadioButtonValue(termOptionsGroup, "termType"),
        mandatoryWork.checked,
        mandatoryWorkAmountText.value,
        abroardEmployeeText.value,
        mscaBox.checked,
        mobility,
        family,
        frameProgramme.value,
        grantNumb.value,

      );

      let htmlText = combineHtmlStrings([htmlHeaderText, htmlBodyText, getArbeidsavtaleFooter(engelsk.checked, nameSign.value, namePos.value)]);
      insertText(htmlText);
    });
  }
}

