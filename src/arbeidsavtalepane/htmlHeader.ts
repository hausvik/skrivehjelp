import { Arbeidsavtaleheader } from "./headerInterface";


export function getArbeidsavtaleHeading(engelsk: boolean, data: Arbeidsavtaleheader): string {
  return engelsk ? getArbeidsavtaleHeadingEngelsk(data) : getArbeidsavtaleHeadingNorsk(data);
}
/**
 * Generates an HTML string representing the header of an employment contract, in English.
 * @function
 * @param {Arbeidsavtale} data - An object representing an employment contract.
 * @returns {string} An HTML string representing the employment contract header.
 */
function getArbeidsavtaleHeadingEngelsk(
  data: Arbeidsavtaleheader
): string {
  const {
    name,
    personalId,
    placeOfWork,
    positionCode,
    percentageFullTime,
    seniority,
    annualSalary,
    mobilityAllowance,
    familyAllowance,
    startingDate,
    endDate,
  } = data;
  let mobilityRow1 = mobilityAllowance!="" && mobilityAllowance!=null ? "Mobilitetstillegg" : "";
  let mobilityRow2 = mobilityAllowance!="" && mobilityAllowance!=null ? `${mobilityAllowance}` : "";
  let familyRow1 = familyAllowance!="" && familyAllowance!=null ? "Familietillegg" : "";
  let familyRow2 = familyAllowance!="" && familyAllowance!=null ? `${familyAllowance}` : "";
  let mobFamAllowance = (mobilityRow2 !== "" || familyRow2 !== "") ?
    `<tr>
          <td>${mobilityRow1}</td>
          <td>${mobilityRow2}</td>
          <td>${familyRow1}</td>
          <td>${familyRow2}</td>
      </tr>` : '';

  return `
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
      </style>
                  <br style='mso-special-character:line-break;page-break-before:always'>
                  <h1>ARBEIDSAVTALE</h1>
      
      
                  <td>${name} har inngått følgende arbeidsavtale med Universitetet i Bergen, Postboks 7800, 5020 Bergen.</td>
                          
      
                  <table>
                          <tr>
                                  <td>Navn</td>
                                  <td>${name}</td>
                                  <td>Fødselsnr.</td>
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
                                  <td>Offentlig tjenesteansiennitet</td>
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

/**
 * Generates an HTML string representing the header of an employment contract, in Norwegian.
 * @function
 * @param {Arbeidsavtale} data - An object representing an employment contract.
 * @returns {string} An HTML string representing the employment contract header.
 */
function getArbeidsavtaleHeadingNorsk(
  data: Arbeidsavtaleheader,

): string {
  return getArbeidsavtaleHeadingEngelsk(data);
}