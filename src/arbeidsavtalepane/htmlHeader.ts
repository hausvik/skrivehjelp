const htmlStyle = `
<style>
          table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid #ddd; /* Light grey border */
        padding: 10px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2; /* Light grey background */
        font-weight: bold;
    }
    tr:nth-child(even) {
        background-color: #f8f8f8; /* Lighter grey for every other row */
    }


</style>`

/**
 * Generates an HTML string representing the header of an employment contract.
 * @function
 * @param {boolean} engelsk - True fir english, false for norwegian.
 * @param {string} name - The name of the employee.
 * @param {string} personalId - The personal ID of the employee.
 * @param {string} placeOfWork - The place of work.
 * @param {string} positionCode - The position code.
 * @param {string} percentageFullTime - The percentage of full-time employment.
 * @param {string} seniority - The seniority level.
 * @param {string} annualSalary - The annual salary.
 * @param {number} mobilityAllowance - The mobility allowance.
 * @param {number} familyAllowance - The family allowance.
 * @param {number} mobilityMonths - The number of months the mobility allowance is paid.
 * @param {number} familyMonths - The number of months the family allowance is paid.
 * @param {string} startingDate - The starting date of the employment.
 * @param {string} endDate - The end date of the employment, if any.
 * @returns {string} An HTML string representing the employment contract header.
 */
export function getArbeidsavtaleHeading(
        engelsk: boolean,
        name: string,
        personalId: string,
        placeOfWork: string,
        positionCode: string,
        percentageFullTime: string,
        seniority: string,
        annualSalary: string,
        mobilityAllowance: number,
        familyAllowance: number,
        mobilityMonths: number,
        familyMonths: number,
        startingDate: string,
        endDate: string
): string {
        // Assuming getArbeidsavtaleHeadingEngelsk and getArbeidsavtaleHeadingNorsk have been updated
        // to accept individual parameters as well.
        return engelsk
                ? getArbeidsavtaleHeadingEngelsk(name, personalId, placeOfWork, positionCode,
                        percentageFullTime, seniority, annualSalary, mobilityAllowance, familyAllowance,
                        mobilityMonths, familyMonths, startingDate, endDate)
                : getArbeidsavtaleHeadingNorsk(name, personalId, placeOfWork, positionCode,
                        percentageFullTime, seniority, annualSalary, mobilityAllowance, familyAllowance,
                        mobilityMonths, familyMonths, startingDate, endDate);
}
/**
 * Generates an HTML string representing the header of an employment contract, in English.
 * @function
 * @param {string} name - The name of the employee.
 * @param {string} personalId - The personal ID of the employee.
 * @param {string} placeOfWork - The place of work.
 * @param {string} positionCode - The position code.
 * @param {string} percentageFullTime - The percentage of full-time employment.
 * @param {string} seniority - The seniority level.
 * @param {string} annualSalary - The annual salary.
 * @param {number} mobilityAllowance - The mobility allowance.
 * @param {number} familyAllowance - The family allowance.
 * @param {number} mobilityMonths - The number of months the mobility allowance is paid.
 * @param {number} familyMonths - The number of months the family allowance is paid.
 * @param {string} startingDate - The starting date of the employment.
 * @param {string} endDate - The end date of the employment, if any.
 * @returns {string} An HTML string representing the employment contract header.
 */
function getArbeidsavtaleHeadingEngelsk(
        name: string,
        personalId: string,
        placeOfWork: string,
        positionCode: string,
        percentageFullTime: string,
        seniority: string,
        annualSalary: string,
        mobilityAllowance: number,
        familyAllowance: number,
        mobilityMonths: number,
        familyMonths: number,
        startingDate: string,
        endDate: string
): string {
        let mobilityRow1 = mobilityAllowance != 0 && mobilityAllowance != null ? "Mobility allowance" : "";
        let mobilityRow2 = mobilityAllowance != 0 && mobilityAllowance != null ? `NOK ${mobilityAllowance} for ${mobilityMonths} months` : "";
        let familyRow1 = familyAllowance != 0 && familyAllowance != null ? "Family allowance" : "";
        let familyRow2 = familyAllowance != 0 && familyAllowance != null ? `NOK ${familyAllowance} for ${familyMonths} months` : "";
        let mobFamAllowance = (mobilityRow2 !== "" || familyRow2 !== "") ?
                `<tr>
          <td>${mobilityRow1}</td>
          <td>${mobilityRow2}</td>
          <td>${familyRow1}</td>
          <td>${familyRow2}</td>
      </tr>` : '';

        return `
  ${htmlStyle}
<br style='mso-special-character:line-break;page-break-before:always'>
<br>
                  <h1 class="h1">EMPLOYMENT AGREEMENT</h1>
      
      
                  <p>${name} has entered into the following employment agreement with the University of Bergen, P.O. Box 7800, 5020 Bergen.</p>

                  <table>
                          <tr>
                                  <td>Name</td>
                                  <td>${name}</td>
                                  <td>Social security number</td>
                                  <td>${personalId}</td>
                          </tr>
                          
                          <tr>
                                  <td>Place of work</td>
                                  <td>${placeOfWork}</td>
                                  <td></td>
                                  <td></td>
                                  
                          </tr>
                          <tr>
                                  <td>Position code</td>
                                  <td>${positionCode}</td>
                                  <td>Percentage of full-time position</td>
                                  <td>${percentageFullTime}</td>
                                  
                          </tr>
                          <tr>
                                  <td>Seniority</td>
                                  <td>${seniority}</td>
                                  <td>Annual salary/salary grade</td>
                                  <td>${annualSalary}</td>
                          </tr>
                          ${mobFamAllowance}
                          <tr>
                                  <td>Start date</td>
                                  <td>${startingDate}</td>
                                  <td>${endDate !== "" ? "End date" : ""}</td>
                                  <td>${endDate !== "" ? endDate : ""}</td>
                          </tr>
                  </table>
                  <br>
      `;
}

/**
 * Generates an HTML string representing the header of an employment contract, in English.
 * @function
 * @param {string} name - The name of the employee.
 * @param {string} personalId - The personal ID of the employee.
 * @param {string} placeOfWork - The place of work.
 * @param {string} positionCode - The position code.
 * @param {string} percentageFullTime - The percentage of full-time employment.
 * @param {string} seniority - The seniority level.
 * @param {string} annualSalary - The annual salary.
 * @param {number} mobilityAllowance - The mobility allowance.
 * @param {number} mobilityMonths - The number of months the mobility allowance is paid.
 * @param {number} familyMonths - The number of months the family allowance is paid.
 * @param {number} familyAllowance - The family allowance.
 * @param {string} startingDate - The starting date of the employment.
 * @param {string} endDate - The end date of the employment, if any.
 * @returns {string} An HTML string representing the employment contract header.
 */
function getArbeidsavtaleHeadingNorsk(
        name: string,
        personalId: string,
        placeOfWork: string,
        positionCode: string,
        percentageFullTime: string,
        seniority: string,
        annualSalary: string,
        mobilityAllowance: number,
        familyAllowance: number,
        mobilityMonths: number,
        familyMonths: number,
        startingDate: string,
        endDate: string
): string {
        let mobilityRow1 = mobilityAllowance != 0 && mobilityAllowance != null ? "Mobilitetstillegg" : "";
        let mobilityRow2 = mobilityAllowance != 0 && mobilityAllowance != null ? `NOK ${mobilityAllowance} i ${mobilityMonths} måneder` : "";
        let familyRow1 = familyAllowance != 0 && familyAllowance != null ? "Familietillegg" : "";
        let familyRow2 = familyAllowance != 0 && familyAllowance != null ? `NOK ${familyAllowance} i ${familyMonths} måneder` : "";
        let mobFamAllowance = (mobilityRow2 !== "" || familyRow2 !== "") ?
                `<tr>
          <td>${mobilityRow1}</td>
          <td>${mobilityRow2}</td>
          <td>${familyRow1}</td>
          <td>${familyRow2}</td>
      </tr>` : '';
        return `
  ${htmlStyle}
          <br style='mso-special-character:line-break;page-break-before:always'>
          <br>
                  <h1 class="h1">ARBEIDSAVTALE</h1>      
                  <p>${name} har inngått følgende arbeidsavtale med Universitetet i Bergen, Postboks 7800, 5020 Bergen.</p>

                  <table>
                          <tr>
                                  <td>Navn</td>
                                  <td>${name}</td>
                                  <td>Fødselsnummer.</td>
                                  <td>${personalId}</td>
                          </tr>
                          
                          <tr>
                                  <td>Arbeidssted</td>
                                  <td>${placeOfWork}</td>
                                  <td></td>
                                  <td></td>
                                  
                          </tr>
                          <tr>
                                  <td>Stilling kode</td>
                                  <td>${positionCode}</td>
                                  <td>Prosentandel av fulltidsstilling</td>
                                  <td>${percentageFullTime}</td>
                                  
                          </tr>
                          <tr>
                                  <td>Stillingsansiennitet</td>
                                  <td>${seniority}</td>
                                  <td>Årslønn/lønnstrinn</td>
                                  <td>${annualSalary}</td>
                          </tr>
                          ${mobFamAllowance}
                          <tr>
                                  <td>Startdato</td>
                                  <td>${startingDate}</td>
                                  <td>${endDate !== "" ? "Slutt dato" : ""}</td>
                                  <td>${endDate !== "" ? endDate : ""}</td>
                          </tr>
                  </table>
      `;
}