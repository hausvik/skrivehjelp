interface TilbudsbrevParams {
    english: boolean;
    employeeType: string;
    externallyFunded: boolean;
    needsNorwegianCompetence: boolean;
    relocateToNorway: boolean;
    eksportlisens: boolean;
    oppholdstillatelse: boolean;
    noBankID: boolean;
    tempYears: string;
    datoForbehold: string;
    avdelingName: string;
    seksjonName: string;
    posCode: string;
    posTitle: string;
    needsEducationalCompetance: boolean;
    careerPromotingWork: string;
    percentageWork: string;
    externalProjectName: string;
    annualSalary: string;
    answerByDate: string;
    answerEmail: string;
    contactLocalName: string;
    contactLocalEmail: string;
    contactHrName: string;
    contactHrEmail: string;
    answerUrl: string;
    qrCode: string;
}

const pTag = `<p class="MsoNormal" style="font-size: 11pt;">`;
const pTagEnd = `</p>`;
/**
 * Generates a job offer letter based on the provided parameters.
 * 
 * @param english - Whether the letter should be in English.
 * @param employeeType - The type of employee.
 * @param externallyFunded - Whether the position is externally funded.
 * @param needsNorwegianCompetence - Whether Norwegian competence is needed.
 * @param relocateToNorway - Whether relocation to Norway is required.
 * @param eksportlisens - Whether an export license is needed.
 * @param oppholdstillatelse - Whether a residence permit is needed.
 * @param noBankID - Whether the employee has no BankID.
 * @param tempYears - The number of temporary years.
 * @param datoForbehold - The date of reservation.
 * @param avdeling - The department information in JSON string format.
 * @param seksjon - The section information in JSON string format.
 * @param posCode - The position code.
 * @param posTitle - The position title.
 * @param needsEducationalCompetance - Whether educational competence is needed.
 * @param careerPromotingWork - The amount of career-promoting work.
 * @param percentageWork - The percentage of work.
 * @param externalProjectName - The name of the external project.
 * @param annualSalary - The annual salary.
 * @param answerByDate - The date by which the answer is needed.
 * @param answerEmail - The email address for responses.
 * @param contactLocalName - The local contact person's name.
 * @param contactLocalEmail - The local contact person's email.
 * @param contactHrName - The HR contact person's name.
 * @param contactHrEmail - The HR contact person's email.
 * @param answerUrl - The URL for the answer form.
 * @param qrCode - The QR code for the answer form.
 * @returns The generated job offer letter as a string.
 */
export function getTilbudsbrev(english: boolean, employeeType: string, externallyFunded: boolean,
    needsNorwegianCompetence: boolean, relocateToNorway: boolean, eksportlisens: boolean, oppholdstillatelse: boolean,
    noBankID: boolean, tempYears: string, datoForbehold: string, avdeling: string, seksjon: string,
    posCode: string, posTitle: string, needsEducationalCompetance: boolean, careerPromotingWork: string, percentageWork: string,
    externalProjectName: string, annualSalary: string, answerByDate: string, answerEmail: string, contactLocalName: string, contactLocalEmail: string,
    contactHrName: string, contactHrEmail: string, answerUrl: string, qrCode: string): string {

    // Get avdelingsnavn
    let avdelingName = "";
    if (avdeling != "") {
        const avdelingObj = JSON.parse(avdeling); // Parse the JSON string
        if (english) {
            avdelingName = avdelingObj.name.eng ? avdelingObj.name.eng : avdelingObj.name.nob; // Try to get eng name, fallback to nob
        } else {
            avdelingName = avdelingObj.name.nob; // Extract the nob name
        }
    }
        // Get seksjonsnavn
        let seksjonName = "";
        if (seksjon != "") {
            const seksjonObj = JSON.parse(seksjon); // Parse the JSON string
            if (english) {
                seksjonName = seksjonObj.name.eng ? seksjonObj.name.eng : seksjonObj.name.nob; // Try to get eng name, fallback to nob
            } else {
                seksjonName = seksjonObj.name.nob; // Extract the nob name
            }
        }

    const params: TilbudsbrevParams = {
        english,
        employeeType,
        externallyFunded,
        needsNorwegianCompetence,
        relocateToNorway,
        eksportlisens,
        oppholdstillatelse,
        noBankID,
        tempYears,
        datoForbehold,
        avdelingName,
        seksjonName,
        posCode,
        posTitle,
        needsEducationalCompetance,
        careerPromotingWork,
        percentageWork,
        externalProjectName,
        annualSalary,
        answerByDate,
        answerEmail,
        contactLocalName,
        contactLocalEmail,
        contactHrName,
        contactHrEmail,
        answerUrl,
        qrCode
    };

    if (english) {
        return getEngelskTilbudsbrev(params);
    } else {
        return getNorskTilbudsbrev(params);
    }
}

function getEngelskTilbudsbrev(params: TilbudsbrevParams): string {
    // Determine the employee type text
    const employeeTypeText = params.employeeType === 'Fast' ? 'permanent' :
        params.employeeType === 'Midlertidig' ? 'temporary' :
            params.employeeType === 'Åremål' ? 'fixed term' : '';

    // Intro tekst
    let introText = pTag + `${params.avdelingName} at the University of Bergen (UiB) has the pleasure of offering you a ${employeeTypeText} position as ${params.posTitle + `, ` + params.posCode} (${params.percentageWork} %) ${params.seksjonName ? `at ${params.seksjonName}` : ``} from the date agreed upon. 
    ${params.employeeType === `Fast` ? `` : `The position is for ${params.tempYears} years. `} ${    params.careerPromotingWork === `0` || params.careerPromotingWork === `` ? ``:`${params.posCode === `1017`? `${params.careerPromotingWork} % will be dedicated to career promoting work.` : ``} ${params.posCode === `1352`? `${params.careerPromotingWork} months will be dedicated to career promoting work.` : ``}`} 
    ${params.externallyFunded ? `The employment is associated with the externally funded project: ${params.externalProjectName}. ` : ``}` + pTagEnd + pTag + `
    
    Your workplace will be at the University of Bergen, and the conditions in this letter are only applicable for work in Norway. ` + pTagEnd

    // Tekst hvis det tas forbehold
    let forbeholdText = ``;
    if (params.oppholdstillatelse || params.eksportlisens) {
        forbeholdText = `<h3>Condition for the offer of employment</h3>` +
            `${params.eksportlisens ? pTag + `In accordance with the advertisement text, the University of Bergen complies with the legislation for export control. We must therefore apply to the relevant authorities for <a href="https://www.regjeringen.no/en/topics/foreign-affairs/export-control/om-eksportkontroll/export-control/id2008483/">export control license</a> for you. ` + pTagEnd : ``}` +
            `${params.oppholdstillatelse ? pTag + `To be able to start in the position you must hold a residence permit for work in Norway.  You will receive the necessary documentation for your application once you have accepted the position. ` + pTagEnd : ``}` +
            pTag + `If conditions for the employment are not met by ${params.datoForbehold} we will withdraw our offer. ` + pTagEnd;
    }

    // Tekst om lønn
    let salaryText = `<h3>Salary</h3>` + pTag + `The position entails membership in the <a href="https://www.spk.no/en/">Norwegian Public Service Pension Fund</a> and salary will be equivalent NOK ${params.annualSalary},- yearly before taxes (in a 100 % position). Further increases in salary will be based on seniority in the position. ` + pTagEnd;

    // Tekst hvis stipendiat
    let stipendiatText = ``;
    if (params.posCode === `1017`) {
        stipendiatText = pTag + `You must be enrolled in the doctoral program (PhD) at ${params.avdelingName} to be a PhD Candidate. Application for admission to the PhD program should be completed no later than one (1) month after you start in the position. ` + pTagEnd + pTag + `You may not undertake duties (additional employments) which exceed the terms of appointment for PhD Candidates. ` + pTagEnd;
    }

    // Tekst hvis forsker
    let forskerText = ``;
    if (params.posCode === `1108` || params.posCode === `1109` || params.posCode === `1110` || params.posCode === `1183`) {
        forskerText = `<h3>The position is based on the following terms (from the announcement):</h3>` +
            `<ul>` +
            `<li>The researcher will be a member of the research group in which the subject area of the position belongs.</li>` +
            `<li>Salary expenses should as far as possible be 100 % externally financed.</li>` +
            `<li>The researcher will actively contribute to obtaining external project funding for the academic community, to both themselves and others, from The Research Council of Norway, the EU as well as other sources.</li>` +
            `<li>The research activity is expected to be funded by the projects the researcher, and the research group, are working on.</li>` +
            `<li>The head of department may instruct the researcher to work towards specific research projects.</li>` +
            `<li>The researcher may partake in duties, participate in committees etc. within the UiB.</li>` +
            `<li>The researcher is normally not obliged to teach but is expected to partake in the supervision of masters- and PhD-students, to the extent that this is a natural part of the work in research group.</li>` +
            `<li>The researcher can apply for competence promotion in accordance with the rules for promotion.</li>` +
            `<li></li>` +
            `</ul>`;
    }


    // Tekst for manglende undervisningskompetanse
    let undervisningskompetanseText = ``;
    if (params.needsEducationalCompetance) {
        undervisningskompetanseText = `<h3>Education competence in university teaching</h3>` + pTag + `With reference to the expert committee’s evaluation report, you must fulfil the requirements for educational competence within the first two years of your employment. The University of Bergen arranges courses in teaching and learning in higher education every semester, and you can attend them for free. You can find the registration form for the course on the <a href="https://www.uib.no/en/uped">University's website</a>.  ` + pTagEnd;
    }

    // Tekst for manglende norsk ferdigheter
    let norskText = ``;
    if (params.needsNorwegianCompetence) {
        norskText = `<h3>Learning Norwegian</h3>` + pTag + `We offer different types and levels of Norwegian language courses for free. You can find more information about language courses <a href="https://www.uib.no/en/international/128581/language-courses">here</a>.` + pTagEnd;
    }

    // Tekst for flytting til Norge
    let relocateText = ``;
    if (params.relocateToNorway) {
        relocateText = `<h3>Relocating to Norway</h3>` + pTag + `On the website for UiB's <a href="https://www.uib.no/en/international/128545/international-staff">International Centre</a> you can find important information about immigration, tax deduction card, necessary steps after arriving to Norway and other useful information about relocation to Norway. UiB offers preboarding seminars to prepare you for your arrival. We suggest that you join the prearrival essential seminar before you start in the position. See the <a href="https://www.uib.no/en/international/calendar">calendar</a> for registration link.` + pTagEnd;
    }


    // Tekst om flytte penger
    let fastAnsettelseText = ``;
    if (params.employeeType === `Fast`) {
        fastAnsettelseText = `<h3>Moving allowance</h3>` + pTag + `You can apply for a moving allowance to assist you with the expenses of moving to Bergen. Read more about this option <a href="https://www.uib.no/en/international/128599/moving-bergen#financial-support-when-moving">here</a>. ` + pTagEnd;
    }


    // Tekst om svarfrist og svar
    let answerText = `<h3>Return the acceptance- and information form </h3>` + pTag + `You can respond to the offer by filling out the form in the link below as soon as possible, and no later than two weeks. If you accept the position, we will send you the employment contract as soon as we have received the form.` + pTagEnd + pTag +
    `${params.answerUrl !== "" ? `<a href="${params.answerUrl}">Confirmation- and personal details form</a>` : `    <b style="color: red; font-size: 16pt;">Kunne ikke generere lenke, bruk <a href='https://digiforms.uib.no/lenkegenerator' style="color: blue; text-decoration: underline;">lenkegeneratoren</a> og lim inn her.</b>`}` + 
    pTagEnd + pTag + `${params.answerUrl !== "" ? `<img src="${params.qrCode}" alt="QR code for the confirmation- and personal details form" />` : ""}` + pTagEnd;
    
    if (params.noBankID) {
        answerText = `<h3>Return the acceptance- and information form </h3>` + pTag + `Please respond to the offer of employment as soon as possible, and within ${params.answerByDate}, to ${params.answerEmail}. ` + pTagEnd 
        + pTag + `If you accept, you must return the acceptance and information form with your response to the offer of employment. ` + pTagEnd
        + (params.oppholdstillatelse ? pTag + `You will receive the necessary documentation for your application for a residence permit once you have accepted the position. ` + pTagEnd : ``);
    }


    // Tekst om å bli kjent med UiB
    let getToKnowUiB = `<h3>Get to know UiB</h3>` + pTag +`We encourage you to get to know UiB better before your first day of work. <a href="https://www.uib.no/en/foremployees/162174/new-employee-university-bergen">This webpage</a> contains much useful information for new employees.` + pTagEnd;


    // Tekst om kontaktinfo
    let contactInfo = `<h3>Contacts</h3>` + pTag + `If you have any questions, please contact (Head of Administration/supervisor) ${params.contactLocalName} (<a href="mailto:${params.contactLocalEmail}">${params.contactLocalEmail}</a>). You can also contact HR adviser ${params.contactHrName} (<a href="mailto:${params.contactHrEmail}">${params.contactHrEmail}</a>)` + pTagEnd
    + pTag + `We take this opportunity to welcome you as an employee at the University of Bergen! ` + pTagEnd;

    return introText + forbeholdText + salaryText + stipendiatText + forskerText + undervisningskompetanseText + norskText + relocateText +fastAnsettelseText + answerText + getToKnowUiB + contactInfo;
}

function getNorskTilbudsbrev(params: TilbudsbrevParams): string {
    // Determine the employee type text
    const employeeTypeText = params.employeeType === 'Fast' ? 'permanent' :
        params.employeeType === 'Midlertidig' ? 'temporary' :
            params.employeeType === 'Åremål' ? 'fixed term' : '';

    // Intro tekst
    let introText = pTag + `${params.avdelingName} at the University of Bergen (UiB) has the pleasure of offering you a ${employeeTypeText} position as ${params.posTitle + `, ` + params.posCode} (${params.percentageWork} %) ${params.seksjonName ? `at ${params.seksjonName}` : ``} from the date agreed upon. 
    ${params.employeeType === `Fast` ? `The position is for ${params.tempYears} years. ` : ``} ${params.posCode === `1017`? `${params.careerPromotingWork} % will be dedicated to career promoting work.` : ``} ${params.posCode === `1352`? `${params.careerPromotingWork} months will be dedicated to career promoting work.` : ``}
    ${params.externallyFunded ? `The employment is associated with the externally funded project: ${params.externalProjectName}. ` : ``}` + pTagEnd + pTag + `
    
    Your workplace will be at the University of Bergen, and the conditions in this letter are only applicable for work in Norway. ` + pTagEnd

    // Tekst hvis det tas forbehold
    let forbeholdText = ``;
    if (params.oppholdstillatelse || params.eksportlisens) {
        forbeholdText = `<h3>Condition for the offer of employment</h3>` +
            `${params.eksportlisens ? pTag + `In accordance with the advertisement text, the University of Bergen complies with the legislation for export control. We must therefore apply to the relevant authorities for <a href="https://www.regjeringen.no/en/topics/foreign-affairs/export-control/om-eksportkontroll/export-control/id2008483/">export control license</a> for you. ` + pTagEnd : ``}` +
            `${params.oppholdstillatelse ? pTag + `To be able to start in the position you must hold a residence permit for work in Norway.  You will receive the necessary documentation for your application once you have accepted the position. ` + pTagEnd : ``}` +
            pTag + `If conditions for the employment are not met by ${params.datoForbehold} we will withdraw our offer. ` + pTagEnd;
    }

    // Tekst om lønn
    let salaryText = `<h3>Salary</h3>` + pTag + `The position entails membership in the Norwegian Public Service Pension Fund and salary will be equivalent NOK ${params.annualSalary},- yearly before taxes (in a 100 % position). Further increases in salary will be based on seniority in the position. ` + pTagEnd;

    // Tekst hvis stipendiat
    let stipendiatText = ``;
    if (params.posCode === `1017`) {
        stipendiatText = pTag + `You must be enrolled in the doctoral program (PhD) at (fakultet) to be a PhD Candidate. Application for admission to the PhD program should be completed no later than one (1) month after you start in the position. ` + pTagEnd + pTag + `You may not undertake duties (additional employments) which exceed the terms of appointment for PhD Candidates. ` + pTagEnd;
    }

    // Tekst hvis forsker
    let forskerText = ``;
    if (params.posCode === `1108` || params.posCode === `1109` || params.posCode === `1110` || params.posCode === `1183`) {
        forskerText = `<h3>The position is based on the following terms (from the announcement):</h3>` +
            `<ul>` +
            `<li>The researcher will be a member of the research group in which the subject area of the position belongs.</li>` +
            `<li>Salary expenses should as far as possible be 100 % externally financed.</li>` +
            `<li>The researcher will actively contribute to obtaining external project funding for the academic community, to both themselves and others, from The Research Council of Norway, the EU as well as other sources.</li>` +
            `<li>The research activity is expected to be funded by the projects the researcher, and the research group, are working on.</li>` +
            `<li>The head of department may instruct the researcher to work towards specific research projects.</li>` +
            `<li>The researcher may partake in duties, participate in committees etc. within the UiB.</li>` +
            `<li>The researcher is normally not obliged to teach but is expected to partake in the supervision of masters- and PhD-students, to the extent that this is a natural part of the work in research group.</li>` +
            `<li>The researcher can apply for competence promotion in accordance with the rules for promotion.</li>` +
            `<li></li>` +
            `</ul>`;
    }


    // Tekst for manglende undervisningskompetanse
    let undervisningskompetanseText = ``;
    if (params.needsEducationalCompetance) {
        undervisningskompetanseText = `<h3>Education competence in university teaching</h3>` + pTag + `With reference to the expert committee’s evaluation report, you must fulfil the requirements for educational competence within the first two years of your employment. The University of Bergen arranges courses in teaching and learning in higher education every semester, and you can attend them for free. You can find the registration form for the course on the <a href="https://www.uib.no/en/uped">University's website</a>.  ` + pTagEnd;
    }

    // Tekst for manglende norsk ferdigheter
    let norskText = ``;
    if (params.needsNorwegianCompetence) {
        norskText = `<h3>Learning Norwegian</h3>` + pTag + `We offer different types and levels of Norwegian language courses for free. You can find more information about language courses <a href="https://www.uib.no/en/international/128581/language-courses">here</a>.` + pTagEnd;
    }

    // Tekst for flytting til Norge
    let relocateText = ``;
    if (params.relocateToNorway) {
        relocateText = `<h3>Relocating to Norway</h3>` + pTag + `On the website for UiB's <a href="https://www.uib.no/en/international/128545/international-staff">International Centre</a> you can find important information about immigration, tax deduction card, necessary steps after arriving to Norway and other useful information about relocation to Norway. UiB offers preboarding seminars to prepare you for your arrival. We suggest that you join the prearrival essential seminar before you start in the position. See the <a href="https://www.uib.no/en/international/calendar">calendar</a> for registration link.` + pTagEnd;
    }


    // Tekst om flytte penger
    let fastAnsettelseText = ``;
    if (params.employeeType === `Fast`) {
        fastAnsettelseText = `<h3>Moving allowance</h3>` + pTag + `You can apply for a moving allowance to assist you with the expenses of moving to Bergen. Read more about this option <a href="https://www.uib.no/en/international/128599/moving-bergen#financial-support-when-moving">here</a>. ` + pTagEnd;
    }


    // Tekst om svarfrist og svar
    let answerText = `<h3>Return the acceptance- and information form </h3>` + pTag + `You can respond to the offer by filling out the form in the link below as soon as possible, and no later than two weeks. If you accept the position, we will send you the employment contract as soon as we have received the form.` + pTagEnd+ pTag +
    `(<i>lim inn lenke og url fra lenkegenerator</i>)` + pTagEnd;

    

    if (params.noBankID) {
    answerText = `<h3>Return the acceptance- and information form </h3>` + pTag + `Please respond to the offer of employment as soon as possible, and within ${params.answerByDate}, to ${params.answerEmail}. ` + pTagEnd 
    + pTag + `If you accept, you must return the acceptance and information form with your response to the offer of employment. ` + pTagEnd
    + params.oppholdstillatelse? pTag + `You will receive the necessary documentation for your application for a residence permit once you have accepted the position. ` + pTagEnd : ``;
    }

    // Tekst om å bli kjent med UiB
    let getToKnowUiB = `<h3>Get to know UiB</h3>` + pTag +`We encourage you to get to know UiB better before your first day of work. <a href="https://www.uib.no/en/foremployees/162174/new-employee-university-bergen">This webpage</a> contains much useful information for new employees.` + pTagEnd;


    // Tekst om kontaktinfo
    let contactInfo = `<h3>Contacts</h3>` + pTag + `If you have any questions, please contact (Head of Administration/supervisor) <a href="mailto:${params.contactLocalEmail}">${params.contactLocalName}</a>. You can also contact HR adviser <a href="mailto:${params.contactHrEmail}">${params.contactHrName}</a>` + pTagEnd
    + pTag + `We take this opportunity to welcome you as an employee at the University of Bergen! ` + pTagEnd;


    return pTag + `Norwegian text is not yet implemented, you should not be able to see this text... What did you do?!?` + pTagEnd;
}