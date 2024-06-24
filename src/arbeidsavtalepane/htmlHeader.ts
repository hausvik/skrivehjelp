import { Arbeidsavtaleheader } from "./headerInterface";

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

p.MsoNormal, li.MsoNormal, div.MsoNormal
{mso-style-unhide:no;
mso-style-qformat:yes;
mso-style-parent:"";
margin-top:0mm;
margin-right:0mm;
margin-bottom:2.0pt;
margin-left:0mm;
line-height:13.0pt;
mso-line-height-rule:exactly;
mso-pagination:widow-orphan;
font-size:11.0pt;
font-family:"Arial",sans-serif;
mso-fareast-font-family:"Times New Roman";
mso-bidi-font-family:"Times New Roman";
color:black;}
h1
{mso-style-unhide:no;
mso-style-qformat:yes;
mso-style-link:"Heading 1 Char";
mso-style-next:Normal;
margin-top:12.0pt;
margin-right:0mm;
margin-bottom:5.0pt;
margin-left:0mm;
line-height:15.0pt;
mso-line-height-rule:exactly;
mso-pagination:widow-orphan;
page-break-after:avoid;
mso-outline-level:1;
font-size:13.0pt;
mso-bidi-font-size:16.0pt;
font-family:"Arial",sans-serif;
color:black;
mso-font-kerning:16.0pt;}
</style>`

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
  let mobilityRow1 = mobilityAllowance != "" && mobilityAllowance != null ? "Mobilitetstillegg" : "";
  let mobilityRow2 = mobilityAllowance != "" && mobilityAllowance != null ? `${mobilityAllowance}` : "";
  let familyRow1 = familyAllowance != "" && familyAllowance != null ? "Familietillegg" : "";
  let familyRow2 = familyAllowance != "" && familyAllowance != null ? `${familyAllowance}` : "";
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
 * Generates an HTML string representing the header of an employment contract, in Norwegian.
 * @function
 * @param {Arbeidsavtale} data - An object representing an employment contract.
 * @returns {string} An HTML string representing the employment contract header.
 */
function getArbeidsavtaleHeadingNorsk(
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
  let mobilityRow1 = mobilityAllowance != "" && mobilityAllowance != null ? "Mobilitetstillegg" : "";
  let mobilityRow2 = mobilityAllowance != "" && mobilityAllowance != null ? `${mobilityAllowance}` : "";
  let familyRow1 = familyAllowance != "" && familyAllowance != null ? "Familietillegg" : "";
  let familyRow2 = familyAllowance != "" && familyAllowance != null ? `${familyAllowance}` : "";
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
                  <br>
      `;
}