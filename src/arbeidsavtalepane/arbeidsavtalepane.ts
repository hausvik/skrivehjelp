/* eslint-disable no-undef */
import { insertText } from "../taskpane/taskpane";
import { getArbeidsavtaleHeadingEngelsk } from "./htmlHeader";
import { getArbeidsavtaleHeadingNorsk } from "./htmlHeader";
import { getArbeidsavtaleBodyNorsk } from "./htmlBody";
import { getArbeidsavtaleBodyEngelsk } from "./htmlBody";
import { Arbeidsavtaleheader } from "./headerInterface";
import { readExcel } from "../utils/readExcel";
import { combineHtmlStrings } from "../utils/combineHTML";

let data: Arbeidsavtaleheader | null = null;
type PositionCode = {
  SKO: string;
  Norsk: string;
  Engelsk: string;
  NorskStillingsbetegnelse: string;
  EngelskStillingsbetegnelse: string;
  Kategori: string;
};

/**
 * Initializes the arbeidsavtalepane by adding event listeners to the input fields and checkboxes.
 */
export async function initializeArbeidsavtalepane() {
  let positionCodes: Promise<PositionCode[]>;
  // Checkboxes
  let tempEmployee: HTMLInputElement | null = document.getElementById("tempEmployee") as HTMLInputElement;
  let engelsk: HTMLInputElement | null = document.getElementById("engelsk") as HTMLInputElement;
  let mobilityAllowanceBox: HTMLInputElement | null = document.getElementById(
    "mobilityAllowanceBox"
  ) as HTMLInputElement;
  let familyAllowanceBox: HTMLInputElement | null = document.getElementById("familyAllowanceBox") as HTMLInputElement;
  let additionalDutyBox: HTMLInputElement | null = document.getElementById("additionalDuty") as HTMLInputElement;
  let teachingPosBox: HTMLInputElement | null = document.getElementById("teachingPos") as HTMLInputElement;
  let teachingPrepBox: HTMLInputElement | null = document.getElementById("teachingPrep") as HTMLInputElement;
  let teachingPrepDiv: HTMLElement | null = document.getElementById("teachingPrepDiv");

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
  let familyAllowanceElement: HTMLInputElement | null = document.getElementById("familyAllowance") as HTMLInputElement;
  let familyAllowanceGroup: HTMLElement | null = document.getElementById("familyAllowanceGroup");
  let mobilityAllowanceGroup: HTMLElement | null = document.getElementById("mobilityAllowanceGroup");
  let endDateGroup: HTMLElement | null = document.getElementById("endDateGroup");

  let button: HTMLButtonElement | null = document.getElementById("generateDocument") as HTMLButtonElement;

  // Adds to the dropdown
  positionCodes = addToDropDown();

  // Event listeners for the dropdown
  if (positionCodeSelect) {
    positionCodeSelect.addEventListener("change", async () => {
      // Get the selected position code
      let selectedPositionCode = positionCodeSelect.value;

      // Find the corresponding position code object
      let positionCodeObject = (await positionCodes).find(
        (positionCode: PositionCode) => positionCode.Norsk === selectedPositionCode
      );

      if (positionCodeObject) {
        let jobTitle = engelsk ? positionCodeObject.EngelskStillingsbetegnelse : positionCodeObject.NorskStillingsbetegnelse; // Might be usefill in the document text
        let category = positionCodeObject.Kategori; //Will be used later, to determin text choices
      }
    });
  }


  // Event listeners for the teachingPosBox
  if (teachingPosBox) {
    teachingPosBox.addEventListener("change", () => {
      if (teachingPrepDiv) {
        if (teachingPosBox.checked) {
          teachingPrepDiv.style.display = 'block'; // Show the teachingPrepBox
        } else {
          teachingPrepDiv.style.display = 'none'; // Hide the teachingPrepBox
        }
      }
    });
  }

  // Event listeners for the teachingPrepBox
  if (teachingPrepBox) {
    teachingPrepBox.addEventListener("change", () => {
      if (teachingPrepBox.checked) {
        preparationHoursDiv.style.display = 'block';
      }
      else {
        preparationHoursDiv.style.display = 'none';
      }
    });
  }

  // Event listner for the tempEmployee box
  if (endDateGroup && tempEmployee) {
    tempEmployee.addEventListener("change", () => {
      endDateGroup.style.display = tempEmployee.checked ? "block" : "none";
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

        let htmlHeaderText: string | null = null;
        let htmlBodyText: string | null = null;
        if (engelsk.checked) {
          htmlHeaderText = getArbeidsavtaleHeadingEngelsk(
            data,
            tempEmployee.checked,
            mobilityAllowanceBox.checked,
            familyAllowanceBox.checked
          );
          htmlBodyText = getArbeidsavtaleBodyEngelsk();
        } else {
          htmlHeaderText = getArbeidsavtaleHeadingNorsk(
            data,
            tempEmployee.checked,
            mobilityAllowanceBox.checked,
            familyAllowanceBox.checked
          );
          htmlBodyText = getArbeidsavtaleBodyNorsk();
        }

        let htmlText = combineHtmlStrings([htmlHeaderText, htmlBodyText]);

        insertText(htmlText);
      }
    });
  }
}

/**
 * Reads the position codes from an Excel file and adds them to the position code dropdown.
 * @returns {Promise<PositionCode[]>} - A promise that resolves to an array of position codes.
 */
async function addToDropDown(): Promise<PositionCode[]> {
  let positionCodes: PositionCode[] = await readExcel("assets/stillingskoder.xlsx");

  let positionCodeSelect: HTMLSelectElement | null = document.getElementById("positionCode") as HTMLSelectElement;

  // Populate the select element with the position codes
  positionCodes.forEach((positionCode: PositionCode, index: number) => {
    // Ignore the first element
    if (index === 0) return;
    // Create a new option element
    let option = document.createElement("option");

    // Set the value and text of the option element
    option.value = positionCode.Norsk;
    option.text = positionCode.Norsk;

    // Add the option element to the select element
    positionCodeSelect.add(option);
  });

  return positionCodes;
}
