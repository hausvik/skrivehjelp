/* eslint-disable no-undef */
import { insertText } from "../taskpane/taskpane";
import { getArbeidsavtaleHeading } from "./htmlHeader";
import { getArbeidsavtale } from "./htmlBody";
import { Arbeidsavtaleheader } from "./headerInterface";
import { addToDropDown, updateDropDown } from "../utils/readExcel";
import { combineHtmlStrings } from "../utils/combineHTML";
import * as radioButtonUtils from "../utils/radioButton";

let headerData: Arbeidsavtaleheader | null = null;


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
      return isEnglish
        ? positionDetails['Engelsk']
        : positionDetails['Norsk'];
    }
    else if (returnType === 1) {
      // Handles no english translation of jobTitle
      if(positionDetails['Engelsk stillingsbetegnelse'] === undefined && isEnglish) {
        return "";
      }
      return isEnglish
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
  updateDropDown(selectElement, filteredPositionCodes);
}

// Function to reset the dropdown
function resetDropdown(AllPositionCodes: PositionCode[], selectElement: HTMLSelectElement): void {
  updateDropDown(selectElement, AllPositionCodes);
}

/**
 * Initializes the arbeidsavtalepane by adding event listeners to the input fields and checkboxes.
 */
export async function initializeArbeidsavtalepane() {

  // Input elements
  let engelsk: HTMLInputElement | null = document.getElementById("engelsk") as HTMLInputElement;
  let mobilityAndFamilyAllowanceBox: HTMLInputElement | null = document.getElementById("mobilityFamilyAllowanceBox") as HTMLInputElement;
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
  let preparationHoursElement: HTMLInputElement | null = document.getElementById("preparationHours") as HTMLInputElement;
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

  // Select elements
  let positionCodeSelect: HTMLSelectElement | null = document.getElementById("positionCode") as HTMLSelectElement;

  // Elements
  let additionalDutyGroup: HTMLElement | null = document.getElementById("additionalDutyGroup") as HTMLElement;
  let teachingPrepDiv: HTMLElement | null = document.getElementById("teachingPrepDiv") as HTMLElement;
  let externallyFundedGroup: HTMLElement | null = document.getElementById("externallyFundedGroup") as HTMLElement;
  let termOptionsGroup: HTMLElement | null = document.getElementById("termOptionsGroup") as HTMLElement;
  let preparationHoursDiv: HTMLElement | null = document.getElementById("preparationHoursDiv") as HTMLElement;
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
  let button: HTMLButtonElement | null = document.getElementById("generateDocument") as HTMLButtonElement;

  // Variables
  let externallyFoundedResearcher = false as boolean;
  let skoTitle = "" as string;
  let jobTitle = "" as string;
  let category = "" as string; // might be usefull?
  let teachingPos = false as boolean;
  let substituteTypeGroupValue = "" as string;
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
  });

  // Event listner for the externallyFunded box
  if (externallyFundedBox) {
    externallyFundedBox.addEventListener("change", () => {
      if (externallyFundedGroup) {
        externallyFundedGroup.style.display = externallyFundedBox.checked ? "block" : "none";
      }
    });
  }


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
      substituteGroup.style.display = "block";
      additionalDutyGroup.style.display = "none";
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

      termOptionsGroup.style.display = "block";
      norwegianCompetence.style.display = "none";
      endDateGroup.style.display = "block";
      substituteGroup.style.display = "none";

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
        substituteAdvertised.checked = false;
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
        mobilityAllowanceElement.value = "";
        familyAllowanceElement.value = "";



      }
    });
  }


  // Button logic
  if (button) {
    button.addEventListener("click", () => {
      if (
        nameElement &&
        personalIdElement &&
        placeOfWorkElement &&
        positionCodeSelect &&
        percentageFullTimeElement &&
        preparationHoursElement &&
        seniorityElement &&
        annualSalaryElement &&
        mobilityAllowanceElement &&
        familyAllowanceElement &&
        startingDateElement &&
        endDateElement
      ) {
        headerData = {
          name: nameElement.value,
          personalId: personalIdElement.value,
          placeOfWork: placeOfWorkElement.value,
          positionCode: skoTitle,
          percentageFullTime: percentageFullTimeElement.value,
          seniority: seniorityElement.value,
          annualSalary: annualSalaryElement.value,
          mobilityAllowance: mobilityAllowanceElement.value,
          familyAllowance: familyAllowanceElement.value,
          startingDate: startingDateElement.value,
          endDate: endDateElement.value,
        };


        if (
          !tempEmployee.checked &&
          externallyFundedBox.checked &&
          (jobTitle === "forsker" || jobTitle === "researcher")
        ) {
          externallyFoundedResearcher = true;
        }
        else {
          externallyFoundedResearcher = false;
        }

        let htmlHeaderText: string | null = null;
        let htmlBodyText: string | null = null;

        htmlHeaderText = getArbeidsavtaleHeading(engelsk.checked, headerData);

        htmlBodyText = getArbeidsavtale(
          engelsk.checked,
          tempEmployee.checked,
          substituteEmployee.checked,
          teachingPos,
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
        );

        let htmlText = combineHtmlStrings([htmlHeaderText, htmlBodyText]);

        insertText(htmlText);
      }
    });
  }
}

