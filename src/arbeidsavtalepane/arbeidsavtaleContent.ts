import { Arbeidsavtaleheader } from "./arbeidsavtaleheader";

/**
 * Generates an HTML string representing the header of an employment contract, in English.
 * @function
 * @param {Arbeidsavtale} data - An object representing an employment contract.
 * @returns {string} An HTML string representing the employment contract header.
 */
export function getArbeidsavtaleHeadingEngelsk(
        data: Arbeidsavtaleheader,
        fastAnsatt: boolean,
        mobility: boolean,
        family: boolean
): string {
        const {
                name,
                personalId,
                placeOfWork,
                positionCode,
                percentageFullTime,
                jobTitle,
                preparationHours,
                seniority,
                annualSalary,
                mobilityAllowance,
                familyAllowance,
                startingDate,
                endDate,
        } = data;
        let mobilityRow1 = mobility ? "Mobility allowance" : "";
        let mobilityRow2 = mobility ? `${mobilityAllowance}` : "";
        let familyRow1 = family ? "Family allowance" : "";
        let familyRow2 = family ? `${familyAllowance}` : "";
        // Use mobilityRow in your table
        return `
        <!DOCTYPE html>
        <html>
        <head>
                <title>CONTRACT OF EMPLOYMENT</title>
        </head>
        <body>
                <h1>CONTRACT OF EMPLOYMENT</h1>


                <td>${name} has entered into the following contract of employment with the University of Bergen, PO Box 7800, 5020 Bergen.</td>
                        

                <table>
                        <tr>
                                <td>Name</td>
                                <td>${name}</td>
                                <td>Personal ID No.</td>
                                <td>${personalId}</td>
                        </tr>
                        
                        <tr>
                                <td>Place of work</td>
                                <td>${placeOfWork}</td>
                                
                        </tr>
                        <tr>
                                <td>Position code</td>
                                <td>${positionCode}</td>
                                <td>Percentage of full-time position</td>
                                <td>${percentageFullTime}</td>
                                
                        </tr>
                        <tr>
                                <td>Job title</td>
                                <td>${jobTitle}</td>
                                <td>Preparation hours</td>
                                <td>${preparationHours}</td>
                        </tr>
                        <tr>
                                <td>Public service seniority</td>
                                <td>${seniority}</td>
                                <td>Annual salary/pay grade</td>
                                <td>${annualSalary}</td>
                        </tr>
                        <tr>
                                <td>${mobilityRow1}</td>
                                <td>${mobilityRow2}</td>
                                <td>${familyRow1}</td>
                                <td>${familyRow2}</td>
                        </tr>
                        <tr>
                                <td>Starting date</td>
                                <td>${startingDate}</td>
                                <td>End date</td>
                                <td>${endDate}</td>
                        </tr>
                </table>
        </body>
        </html>
    `;
}

/**
 * Generates an HTML string representing the header of an employment contract, in Norwegian.
 * @function
 * @param {Arbeidsavtale} data - An object representing an employment contract.
 * @returns {string} An HTML string representing the employment contract header.
 */
export function getArbeidsavtaleHeadingNorsk(
        data: Arbeidsavtaleheader,
        fastAnsatt: boolean,
        mobility: boolean,
        family: boolean
): string {
        const {
                name,
                personalId,
                placeOfWork,
                positionCode,
                percentageFullTime,
                jobTitle,
                preparationHours,
                seniority,
                annualSalary,
                mobilityAllowance,
                familyAllowance,
                startingDate,
                endDate,
        } = data;
        let mobilityRow1 = mobility ? "Mobilitetstillegg" : "";
        let mobilityRow2 = mobility ? `${mobilityAllowance}` : "";
        let familyRow1 = family ? "Familietillegg" : "";
        let familyRow2 = family ? `${familyAllowance}` : "";
        return `
    <!DOCTYPE html>
    <html>
    <head>
            <title>ARBEIDSAVTALE</title>
    </head>
    <body>
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
                            
                    </tr>
                    <tr>
                            <td>Stilling kode</td>
                            <td>${positionCode}</td>
                            <td>Prosentandel av fulltidsstilling</td>
                            <td>${percentageFullTime}</td>
                            
                    </tr>
                    <tr>
                            <td>Jobbtittel</td>
                            <td>${jobTitle}</td>
                            <td>Antall forberedelsestimer</td>
                            <td>${preparationHours}</td>
                    </tr>
                    <tr>
                            <td>Offentlig tjenesteansiennitet</td>
                            <td>${seniority}</td>
                            <td>Årslønn/lønnstrinn</td>
                            <td>${annualSalary}</td>
                    </tr>
                    <tr>
                            <td>${mobilityRow1}</td>
                            <td>${mobilityRow2}</td>
                            <td>${familyRow1}</td>
                            <td>${familyRow2}</td>
                    </tr>
                    <tr>
                            <td>Startdato</td>
                            <td>${startingDate}</td>
                            <td>Sluttdato</td>
                            <td>${endDate}</td>
                    </tr>
            </table>
    </body>
    </html>
`;
}