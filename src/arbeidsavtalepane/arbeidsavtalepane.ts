/* eslint-disable no-undef */
import { insertText } from "../taskpane/taskpane";
import { getArbeidsavtaleHeadingEngelsk } from "./arbeidsavtaleContent";
import { getArbeidsavtaleHeadingNorsk } from "./arbeidsavtaleContent";
import { Arbeidsavtaleheader } from "./arbeidsavtaleheader";
import { readCSV } from "../utils/readCSV";

let data: Arbeidsavtaleheader | null = null;

export async function initializeArbeidsavtalepane() {
  let positionCodes = await readCSV("assets/stillingskoder.csv");
  // Checkboxes
  let fastansatt: HTMLInputElement | null = document.getElementById("fastansatt") as HTMLInputElement;
  let engelsk: HTMLInputElement | null = document.getElementById("engelsk") as HTMLInputElement;
  let mobilityAllowanceBox: HTMLInputElement | null = document.getElementById(
    "mobilityAllowanceBox"
  ) as HTMLInputElement;
  let familyAllowanceBox: HTMLInputElement | null = document.getElementById("familyAllowanceBox") as HTMLInputElement;

  //input fields
  let nameElement: HTMLInputElement | null = document.getElementById("name") as HTMLInputElement;
  let personalIdElement: HTMLInputElement | null = document.getElementById("personalId") as HTMLInputElement;
  let placeOfWorkElement: HTMLInputElement | null = document.getElementById("placeOfWork") as HTMLInputElement;
  let positionCodeSelect: HTMLSelectElement | null = document.getElementById("positionCode") as HTMLSelectElement;
  let percentageFullTimeElement: HTMLInputElement | null = document.getElementById(
    "percentageWork"
  ) as HTMLInputElement;
  let jobTitleElement: HTMLInputElement | null = document.getElementById("jobTitle") as HTMLInputElement;
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

  // Define a type for position code
  type PositionCode = {
    SKO: string;
    EnglishTitle: string;
    NorwegianTitle: string;
    Category: string;
  };

  // Populate the select element with the position codes
  positionCodes.forEach((positionCode: PositionCode) => {
    // Create a new option element
    let option = document.createElement("option");

    // Set the value and text of the option element
    option.value = positionCode.SKO;
    option.text = `${positionCode.SKO} - ${engelsk.checked ? positionCode.EnglishTitle : positionCode.NorwegianTitle}`;

    // Add the option element to the select element
    positionCodeSelect.add(option);
  });

  // Hide the mobility and family allowance fields and labels as default
  if (mobilityAllowanceGroup) {
    mobilityAllowanceGroup.style.display = "none";
  }
  if (familyAllowanceGroup) {
    familyAllowanceGroup.style.display = "none";
  }

  if (endDateGroup && fastansatt) {
    fastansatt.addEventListener("change", () => {
      endDateGroup.style.display = fastansatt.checked ? "none" : "block";
    });
  }

  if (familyAllowanceBox) {
    familyAllowanceBox.addEventListener("change", () => {
      if (familyAllowanceGroup) {
        familyAllowanceGroup.style.display = familyAllowanceBox.checked ? "block" : "none";
      }
    });
  }

  if (mobilityAllowanceBox) {
    mobilityAllowanceBox.addEventListener("change", () => {
      if (mobilityAllowanceGroup) {
        mobilityAllowanceGroup.style.display = mobilityAllowanceBox.checked ? "block" : "none";
      }
    });
  }

  if (button) {
    button.addEventListener("click", () => {
      if (
        nameElement &&
        personalIdElement &&
        placeOfWorkElement &&
        positionCodeSelect &&
        percentageFullTimeElement &&
        jobTitleElement &&
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
          jobTitle: jobTitleElement.value,
          preparationHours: preparationHoursElement.value,
          seniority: seniorityElement.value,
          annualSalary: annualSalaryElement.value,
          mobilityAllowance: mobilityAllowanceElement.value,
          familyAllowance: familyAllowanceElement.value,
          startingDate: startingDateElement.value,
          endDate: endDateElement.value,
        };

        let htmlText: string | null = null;
        if (engelsk.checked) {
          htmlText = getArbeidsavtaleHeadingEngelsk(
            data,
            fastansatt.checked,
            mobilityAllowanceBox.checked,
            familyAllowanceBox.checked
          );
        } else {
          htmlText = getArbeidsavtaleHeadingNorsk(
            data,
            fastansatt.checked,
            mobilityAllowanceBox.checked,
            familyAllowanceBox.checked
          );
        }

        insertText(htmlText);
      }
    });
  }
}
