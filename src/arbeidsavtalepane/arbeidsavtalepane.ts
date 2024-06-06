import { insertText } from "../taskpane/taskpane";
import { getArbeidsavtaleHeadingEngelsk } from "./arbeidsavtaleContent";
import { getArbeidsavtaleHeadingNorsk } from "./arbeidsavtaleContent";
import { Arbeidsavtaleheader } from "./arbeidsavtaleheader";

let data: Arbeidsavtaleheader | null = null;

export function initializeArbeidsavtalepane() {
  // Checkboxes
  let fastansatt = document.getElementById("fastansatt") as HTMLInputElement;
  let engelsk = document.getElementById("engelsk") as HTMLInputElement;
  let mobilityAllowanceBox = document.getElementById("mobilityAllowanceBox") as HTMLInputElement;
  let familyAllowanceBox = document.getElementById("familyAllowanceBox") as HTMLInputElement;

  //input fields
  let nameElement: HTMLInputElement | null = document.getElementById("name") as HTMLInputElement;
  let personalIdElement: HTMLInputElement | null = document.getElementById("personalId") as HTMLInputElement;
  let placeOfWorkElement: HTMLInputElement | null = document.getElementById("placeOfWork") as HTMLInputElement;
  let positionCodeElement: HTMLInputElement | null = document.getElementById("positionCode") as HTMLInputElement;
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

  //hides the mobility and family allowance fields as default
  mobilityAllowanceElement.style.display = "none";
  familyAllowanceElement.style.display = "none";

  if (fastansatt) {
    fastansatt.addEventListener("change", () => {
      if (endDateElement) {
        endDateElement.style.display = fastansatt.checked ? "none" : "block";
      }
    });
  }

  if (familyAllowanceBox) {
    familyAllowanceBox.addEventListener("change", () => {
      if (familyAllowanceElement) {
        familyAllowanceElement.style.display = familyAllowanceBox.checked ? "none" : "block";
      }
    });
  }

  if (mobilityAllowanceBox) {
    mobilityAllowanceBox.addEventListener("change", () => {
      if (mobilityAllowanceElement) {
        mobilityAllowanceElement.style.display = mobilityAllowanceBox.checked ? "none" : "block";
      }
    });
  }

  if (button) {
    button.addEventListener("click", () => {
      if (
        nameElement &&
        personalIdElement &&
        placeOfWorkElement &&
        positionCodeElement &&
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
          positionCode: positionCodeElement.value,
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
          htmlText = getArbeidsavtaleHeadingEngelsk(data);
        } else {
          htmlText = getArbeidsavtaleHeadingNorsk(data);
        }

        if (htmlText != null) {
          insertText(htmlText);
        }
      }
    });
  }
}
