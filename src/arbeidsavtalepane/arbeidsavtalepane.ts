/* eslint-disable no-undef */
import { insertText } from "../taskpane/taskpane";
import { getArbeidsavtaleHeadingEngelsk } from "./htmlHeader";
import { getArbeidsavtaleHeadingNorsk } from "./htmlHeader";
import { getArbeidsavtaleBodyNorsk } from "./htmlBody";
import { getArbeidsavtaleBodyEngelsk } from "./htmlBody";
import { Arbeidsavtaleheader } from "./headerInterface";
import { addToDropDown } from "../utils/readExcel";
import { combineHtmlStrings } from "../utils/combineHTML";
import * as radioButtonUtils from "../utils/radioButton";

let data: Arbeidsavtaleheader | null = null;
type PositionCode = {
  SKO: string;
  Norsk: string;
  Engelsk: string;
  norJobTitle: string;
  engJobTitle: string;
  Kategori: string;
};

/**
 * Get job title or category from a position code.
 * @param positionCodesElement Element from the positionCodes array
 * @param checkString String to check for
 * @param returnType 1 to return jobTitle, 2 to return category
 * @param isEnglish Boolean to specify whether to return the Norwegian or English job title
 * @returns Job title or category, depending on returnType
 */
function getPositionDetail(positionCodesElement: any, checkString: string, returnType: number, isEnglish: boolean) {
  const positionDetails = positionCodesElement.find((c: any) => c.Norsk === checkString) || null;

  if (positionDetails) {
    if (returnType === 1) {
      return isEnglish
        ? positionDetails['Engelsk stillingsbetegnelse'].toLowerCase()
        : positionDetails['Norsk stillingsbetegnelse'].toLowerCase();
    } else if (returnType === 2) {
      return positionDetails['Kategori'];
    }
  }

  return null;
}

/**
 * Initializes the arbeidsavtalepane by adding event listeners to the input fields and checkboxes.
 */
export async function initializeArbeidsavtalepane() {
  let positionCodes: PositionCode[];
  // Checkboxes
  let engelsk: HTMLInputElement | null = document.getElementById("engelsk") as HTMLInputElement;
  let mobilityAllowanceBox: HTMLInputElement | null = document.getElementById(
    "mobilityAllowanceBox"
  ) as HTMLInputElement;
  let familyAllowanceBox: HTMLInputElement | null = document.getElementById("familyAllowanceBox") as HTMLInputElement;
  let additionalDutyBox: HTMLInputElement | null = document.getElementById("additionalDuty") as HTMLInputElement;
  let additionalDutyGroup: HTMLElement | null = document.getElementById("additionalDutyGroup") as HTMLElement;
  let additionalDutyText: HTMLInputElement | null = document.getElementById("additionalDutyText") as HTMLInputElement;
  let teachingPosBox: HTMLInputElement | null = document.getElementById("teachingPos") as HTMLInputElement;
  let teachingPrepBox: HTMLInputElement | null = document.getElementById("teachingPrep") as HTMLInputElement;
  let teachingPrepDiv: HTMLElement | null = document.getElementById("teachingPrepDiv") as HTMLElement;
  let externallyFundedBox: HTMLInputElement | null = document.getElementById("externallyFunded") as HTMLInputElement;
  let externallyFundedGroup: HTMLElement | null = document.getElementById("externallyFundedGroup") as HTMLElement;
  let externallyFundedProjectName: HTMLInputElement | null = document.getElementById(
    "externallyFundedProjectName"
  ) as HTMLInputElement;
  let externallyFundedEndDate: HTMLInputElement | null = document.getElementById(
    "externallyFundedEndDate"
  ) as HTMLInputElement;
  let externallyFundedTasks: HTMLInputElement | null = document.getElementById(
    "externallyFundedTasks"
  ) as HTMLInputElement;

  //termEmployeeGroup
  let termOptionsGroup: HTMLElement | null = document.getElementById("termOptionsGroup") as HTMLElement;
  //input fields
  let nameElement: HTMLInputElement | null = document.getElementById("name") as HTMLInputElement;
  let personalIdElement: HTMLInputElement | null = document.getElementById("personalId") as HTMLInputElement;
  let placeOfWorkElement: HTMLInputElement | null = document.getElementById("placeOfWork") as HTMLInputElement;
  let positionCodeSelect: HTMLSelectElement | null = document.getElementById("positionCode") as HTMLSelectElement;
  let percentageFullTimeElement: HTMLInputElement | null = document.getElementById(
    "percentageWork"
  ) as HTMLInputElement;
  let preparationHoursDiv: HTMLElement | null = document.getElementById("preparationHoursDiv") as HTMLElement;
  let preparationHoursElement: HTMLInputElement | null = document.getElementById(
    "preparationHours"
  ) as HTMLInputElement;
  let seniorityElement: HTMLInputElement | null = document.getElementById("seniority") as HTMLInputElement;
  let annualSalaryElement: HTMLInputElement | null = document.getElementById("annualSalary") as HTMLInputElement;
  let startingDateElement: HTMLInputElement | null = document.getElementById("startingDate") as HTMLInputElement;
  let endDateElement: HTMLInputElement | null = document.getElementById("endDate") as HTMLInputElement;
  let mobilityAllowanceElement: HTMLInputElement | null = document.getElementById(
    "mobilityAllowance"
  ) as HTMLInputElement;
  let workDescriptionElement: HTMLInputElement | null = document.getElementById("workDescription") as HTMLInputElement;
  let workDescriptionText: HTMLInputElement | null = document.getElementById("workDescriptionText") as HTMLInputElement;
  let familyAllowanceElement: HTMLInputElement | null = document.getElementById("familyAllowance") as HTMLInputElement;
  let familyAllowanceGroup: HTMLElement | null = document.getElementById("familyAllowanceGroup");
  let mobilityAllowanceGroup: HTMLElement | null = document.getElementById("mobilityAllowanceGroup");
  let endDateGroup: HTMLElement | null = document.getElementById("endDateGroup");
  let button: HTMLButtonElement | null = document.getElementById("generateDocument") as HTMLButtonElement;
  let mandatoryWork: HTMLInputElement | null = document.getElementById("mandatoryWork") as HTMLInputElement;
  let mandatoryWorkAmount: HTMLElement | null = document.getElementById("mandatoryWorkAmount") as HTMLElement;
  let mandatoryWorkAmountText: HTMLInputElement | null = document.getElementById("mandatoryWorkAmountText") as HTMLInputElement;
  let educationalCompetence: HTMLElement | null = document.getElementById("educationalCompetence") as HTMLElement;
  let norwegianCompetence: HTMLElement | null = document.getElementById("norwegianCompetence") as HTMLElement;
  let substituteGroup: HTMLElement | null = document.getElementById("substituteGroup") as HTMLElement; // main group for substitute
  let substituteAdvertised: HTMLInputElement | null = document.getElementById(
    "substituteAdvertised"
  ) as HTMLInputElement;
  let substituteTypeGroup: HTMLElement | null = document.getElementById("substituteTypeGroup") as HTMLElement; // radiobuttongroup for substitute
  let substituteForGroup: HTMLInputElement | null = document.getElementById("substiuteForGroup") as HTMLInputElement; // input field for substitute
  let substituteFor: HTMLInputElement | null = document.getElementById("substituteFor") as HTMLInputElement; // textField
  let employeeTypeRadio: HTMLElement | null = document.getElementById("employeeTypeRadio") as HTMLElement; // radio group for employee type
  let employee: HTMLInputElement | null = document.getElementById("employee") as HTMLInputElement; // radio button for employee
  let tempEmployee: HTMLInputElement | null = document.getElementById("tempEmployee") as HTMLInputElement; // radio button for tempEmployee
  let substituteEmployee: HTMLInputElement | null = document.getElementById("substituteEmployee") as HTMLInputElement; // radio button for substituteEmployee
  let termEmployee: HTMLInputElement | null = document.getElementById("termEmployee") as HTMLInputElement;

  let researchFellow: HTMLInputElement | null = document.getElementById("researchFellow") as HTMLInputElement; // radio button for researchFellow
  let artisticFellow: HTMLInputElement | null = document.getElementById("artisticFellow") as HTMLInputElement; // radio button for artisticFellow
  let postdoktor: HTMLInputElement | null = document.getElementById("postdoc") as HTMLInputElement; // radio button for postdoktor
  let scientificAssistant: HTMLInputElement | null = document.getElementById("scientificAssistant") as HTMLInputElement; // radio button for scientificAssistant
  let norwegianCompetenceGroup: HTMLElement | null = document.getElementById("norwegianCompetenceGroup") as HTMLElement; // radio group for norwegian competence

  // Variables for the text choices
  let externallyFoundedResearcher = false as boolean;
  let jobTitle = "" as string;
  let category = "" as string; // might be usefull?
  let substituteTypeGroupValue = "" as string;

  // Adds to the dropdown
  positionCodes = await addToDropDown('assets\\stillingskoder.xlsx', 'positionCode')

  positionCodeSelect?.addEventListener("change", async () => {
    // Get the selected position code
    const selectedPositionCode = positionCodeSelect.value;

    // Get the corresponding position details
    jobTitle = getPositionDetail(positionCodes, selectedPositionCode, 1, engelsk.checked);
    category = getPositionDetail(positionCodes, selectedPositionCode, 2, engelsk.checked);

    if (employee.checked && category ==="V") {
      norwegianCompetence.style.display = "block";
    }
    else {
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

  // Event listeners for the teachingPosBox
  if (teachingPosBox) {
    teachingPosBox.addEventListener("change", () => {
      const displayValue = teachingPosBox.checked && !tempEmployee.checked ? "block" : "none";
      educationalCompetence.style.display = displayValue; // Show or hide the educationalCompetence

      if (!teachingPosBox.checked) {
        radioButtonUtils.uncheckAllRadioButtons(educationalCompetence, "educationalCompetence");
      }
      if (teachingPrepDiv) {
        teachingPrepDiv.style.display = displayValue; // Show or hide the tchingPrepBox
      }
    });
  }

  // Event listeners for the teachingPrepBox
  if (teachingPrepBox) {
    teachingPrepBox.addEventListener("change", () => {
      if (teachingPrepBox.checked) {
        preparationHoursDiv.style.display = "block";
      } else {
        preparationHoursDiv.style.display = "none";
      }
    });
  }

  // Event listener for the employee radio button
  if (employee && endDateGroup) {
    employee.addEventListener("change", () => {
      // Code for when "Fast ansatt" is selected
      endDateGroup.style.display = "none";
      additionalDutyGroup.style.display = "none";
      substituteGroup.style.display = "none";
      termOptionsGroup.style.display = "none";
    });
  }

  // Event listener for the tempEmployee radio button
  if (tempEmployee && endDateGroup) {
    tempEmployee.addEventListener("change", () => {
      // Code for when "Midlertidig" is selected
      endDateGroup.style.display = "block";
      workDescriptionElement.style.display = "block";
      norwegianCompetence.style.display = "none";
      additionalDutyGroup.style.display = "none";
      substituteGroup.style.display = "none";
      termOptionsGroup.style.display = "none";
      norwegianCompetence.style.display = "none";
      if (teachingPosBox.checked) { educationalCompetence.style.display = "none"; }
    });
  }

  // Event listener for the substituteEmployee radio button
  if (substituteEmployee && endDateGroup) {
    substituteEmployee.addEventListener("change", () => {
      // Code for when "Vikar" is selected
      substituteGroup.style.display = "block";
      additionalDutyGroup.style.display = "none";
      endDateGroup.style.display = "none";
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

  // Event listener for the termEmployee radio button
  if (termEmployee && endDateGroup) {
    termEmployee.addEventListener("change", () => {
      // Code for when "Åremål" is selected
      termOptionsGroup.style.display = "block";
      norwegianCompetence.style.display = "none";
      endDateGroup.style.display = "block";
      substituteGroup.style.display = "none";

    });
  }

  //Event listner for mandatoryWork (karrierefremmende arbeid)
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

  // Add event listeners
  if (researchFellow) {
    researchFellow.addEventListener('click', () => {
      positionCodeSelect.value = "1017 - Stipendiat";
      jobTitle = getPositionDetail(positionCodes, positionCodeSelect.value, 1, engelsk.checked);
      category = getPositionDetail(positionCodes, positionCodeSelect.value, 2, engelsk.checked);
    });
  }

  if (artisticFellow) {
    artisticFellow.addEventListener('click', () => {
      positionCodeSelect.value = "1017 - Stipendiat";
      jobTitle = getPositionDetail(positionCodes, positionCodeSelect.value, 1, engelsk.checked);
      category = getPositionDetail(positionCodes, positionCodeSelect.value, 2, engelsk.checked);
    });
  }

  if (postdoktor) {
    postdoktor.addEventListener('click', () => {
      positionCodeSelect.value = "1352 - Postdoktor";
      jobTitle = getPositionDetail(positionCodes, positionCodeSelect.value, 1, engelsk.checked);
      category = getPositionDetail(positionCodes, positionCodeSelect.value, 2, engelsk.checked);
    });
  }

  // Event listeners for the familyAllowanceBox
  if (familyAllowanceBox) {
    familyAllowanceBox.addEventListener("change", () => {
      if (familyAllowanceGroup) {
        familyAllowanceGroup.style.display = familyAllowanceBox.checked ? "block" : "none";
      }
    });
  }
  // Event listeners for the mobilityAllowanceBox
  if (mobilityAllowanceBox) {
    mobilityAllowanceBox.addEventListener("change", () => {
      if (mobilityAllowanceGroup) {
        mobilityAllowanceGroup.style.display = mobilityAllowanceBox.checked ? "block" : "none";
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
        data = {
          name: nameElement.value,
          personalId: personalIdElement.value,
          placeOfWork: placeOfWorkElement.value,
          positionCode: positionCodeSelect.value,
          percentageFullTime: percentageFullTimeElement.value,
          preparationHours: preparationHoursElement.value,
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

        if (engelsk.checked) {
          htmlHeaderText = getArbeidsavtaleHeadingEngelsk(
            data,
            tempEmployee.checked,
            mobilityAllowanceBox.checked,
            familyAllowanceBox.checked
          );
          htmlBodyText = getArbeidsavtaleBodyEngelsk(
            tempEmployee.checked,
            substituteEmployee.checked,
            teachingPosBox.checked,
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
          );
        } else {
          htmlHeaderText = getArbeidsavtaleHeadingNorsk(
            data,
            tempEmployee.checked,
            mobilityAllowanceBox.checked,
            familyAllowanceBox.checked
          );
          htmlBodyText = getArbeidsavtaleBodyNorsk(
            tempEmployee.checked,
            substituteEmployee.checked,
            teachingPosBox.checked,
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
          );
        }

        let htmlText = combineHtmlStrings([htmlHeaderText, htmlBodyText]);

        insertText(htmlText);
      }
    });
  }
}

