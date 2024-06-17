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
 * Initializes the arbeidsavtalepane by adding event listeners to the input fields and checkboxes.
 */
export async function initializeArbeidsavtalepane() {
  let positionCodes: PositionCode[];
  // Checkboxes
  let termCheckBox: HTMLInputElement | null = document.getElementById("termCheckBox") as HTMLInputElement;
  let tempEmployee: HTMLInputElement | null = document.getElementById("tempEmployee") as HTMLInputElement;
  let substituteEmployee: HTMLInputElement | null = document.getElementById("substituteEmployee") as HTMLInputElement;
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

  //termcheckboxGroup
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

  //radio buttons and such
  let educationalCompetence: HTMLElement | null = document.getElementById("educationalCompetence") as HTMLElement;
  let norwegianCompetence: HTMLElement | null = document.getElementById("norwegianCompetence") as HTMLElement;
  let substituteGroup: HTMLElement | null = document.getElementById("substituteGroup") as HTMLElement; // main group for substitute
  let substituteAdvertised: HTMLInputElement | null = document.getElementById(
    "substituteAdvertised"
  ) as HTMLInputElement; // checkbox for substitute
  let substituteTypeGroup: HTMLElement | null = document.getElementById("substituteTypeGroup") as HTMLElement; // radiobuttongroup for substitute
  let substituteForGroup: HTMLInputElement | null = document.getElementById("substiuteForGroup") as HTMLInputElement; // input field for substitute
  let substituteFor: HTMLInputElement | null = document.getElementById("substituteFor") as HTMLInputElement; // textField

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
    const positionDetails = positionCodes.find(c => c.Norsk === selectedPositionCode) || null;


    if (positionDetails) {
      jobTitle = engelsk.checked
        ? (positionDetails as any)['Engelsk stillingsbetegnelse']
        : (positionDetails as any)['Norsk stillingsbetegnelse'];
      jobTitle = jobTitle.toLowerCase();
      category = (positionDetails as any)['Kategori']; // might be usefull?
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

// termCheckBox event listener
if(termCheckBox) {
  termCheckBox.addEventListener("change", () => {
    if (termCheckBox.checked) {
      termOptionsGroup.style.display = "block";
    } else {
      termOptionsGroup.style.display = "none";
      radioButtonUtils.uncheckAllRadioButtons(termOptionsGroup, "termType");
      additionalDutyGroup.style.display = "none";
    }
  });
}

// Event listener for termOptionsGroup
if (termOptionsGroup) {
  termOptionsGroup.addEventListener("change", () => {
    radioButtonUtils.checkSelectedRadioButtonValue(termOptionsGroup, "termType", "ekstraverv")? 
      additionalDutyGroup.style.display = "block":
      additionalDutyGroup.style.display = "none";
    }
  );
}

  // Event listener for the tempEmployee box
  if (endDateGroup && tempEmployee) {
    tempEmployee.addEventListener("change", () => {
      endDateGroup.style.display = tempEmployee.checked ? "block" : "none";
      if (!tempEmployee.checked) {
        substituteEmployee.checked = false;
        substituteGroup.style.display = "none";
        workDescriptionElement.style.display = "none";
        substituteFor.value = "";
        substituteFor.value = "";
        substituteForGroup.style.display = "none";
        substituteAdvertised.checked = false;
        norwegianCompetence.style.display = "block";
        const radios = substituteTypeGroup.querySelectorAll('input[type="radio"]');
        radios.forEach((radio: Element) => {
          (radio as HTMLInputElement).checked = false;
        });
        if (teachingPosBox.checked) { educationalCompetence.style.display = "block"; }
      }
      else {
        workDescriptionElement.style.display = "block";
        norwegianCompetence.style.display = "none";
        if (teachingPosBox.checked) { educationalCompetence.style.display = "none"; }
      }
    });
  }

  if (substituteEmployee) {
    substituteEmployee.addEventListener("change", () => {
      if (substituteEmployee.checked) {
        tempEmployee.checked = true;
        substituteGroup.style.display = "block";
      } else {
        substituteGroup.style.display = "none";

        const radios = substituteTypeGroup.querySelectorAll('input[type="radio"]');
        radios.forEach((radio: Element) => {
          (radio as HTMLInputElement).checked = false;
        });
        substituteFor.value = "";
        substituteAdvertised.checked = false;
      }
    });
  }

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
          (jobTitle === "Forsker" || jobTitle === "Researcher")
        ) {
          externallyFoundedResearcher = true;
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
          );
        }

        let htmlText = combineHtmlStrings([htmlHeaderText, htmlBodyText]);

        insertText(htmlText);
      }
    });
  }
}

