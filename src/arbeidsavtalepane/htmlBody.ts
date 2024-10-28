/**
 *  This function returns the body of the arbeidsavtalepane in Norwegian or English.
 * @param engelsk True if the document should be in English, false if it should be in Norwegian.
 * @param fastAnsatt True if the employee is permanent, false if the employee is temporary.
 * @param vikar True if the employee is a substitute, false if the employee is not a substitute.
 * @param underviser True if the employee is a teacher, false if the employee is not a teacher.
 * @param jobTitle The job title.
 * @param educationalCompetenceValue True if educational competence is needed, false if it is not needed.
 * @param norwegianCompetenceParam True if Norwegian competence is needed, false if it is not needed.
 * @param externallyFunded True if the employee is externally funded, false if the employee is not externally funded.
 * @param projectName The name of the project.
 * @param projectEndDate The end date of the project.
 * @param projectTasks The tasks to be performed for the project.
 * @param externallyFoundedResearcher True if the researcher is externally funded, false if the researcher is not externally funded.
 * @param substituteAdvertised True if the substitute is advertised, false if the substitute is not advertised.
 * @param substituteTypeGroupValue The type of substitute.
 * @param substituteFor The person/group for whom the substitute is for.
 * @param workDescription The description of the work to be done.
 * @param additionalDuty The additional duties.
 * @param termEmployee The type of term employee.
 * @param karrierefremmendeArbeid True if the work is career-promoting, false if it is not.
 * @param termAmount The amount of term work.
 * @returns The body of the document as an HTMLString.
 */
export function getArbeidsavtale(
  engelsk: boolean,
  fastAnsatt: boolean,
  vikar: boolean,
  underviser: boolean,
  jobTitle: string,
  educationalCompetenceValue: boolean,
  norwegianCompetenceParam: boolean,
  externallyFunded: boolean,
  projectName: string,
  projectEndDate: string,
  projectTasks: string,
  externallyFoundedResearcher: boolean,
  substituteAdvertised: boolean,
  substituteTypeGroupValue: string,
  substituteFor: string,
  workDescription: string,
  additionalDuty: string,
  termEmployee: string,
  karrierefremmendeArbeid: boolean,
  termAmount: string,
  abroardEmployeeText: string,
  mscaBox: boolean,
  mobility: boolean,
  family: boolean,
  frameProgram: string,
  grantNumber: string,
): string {
  if (engelsk) {
    return getArbeidsavtaleBodyEngelsk(
      fastAnsatt,
      vikar,
      underviser,
      jobTitle,
      educationalCompetenceValue,
      norwegianCompetenceParam,
      externallyFunded,
      projectName,
      projectEndDate,
      projectTasks,
      externallyFoundedResearcher,
      substituteAdvertised,
      substituteTypeGroupValue,
      substituteFor,
      workDescription,
      additionalDuty,
      termEmployee,
      karrierefremmendeArbeid,
      termAmount,
      abroardEmployeeText,
      mscaBox,
      mobility,
      family,
      frameProgram,
      grantNumber);
  }
  else {
    return getArbeidsavtaleBodyNorsk(
      fastAnsatt,
      vikar,
      underviser,
      jobTitle,
      educationalCompetenceValue,
      norwegianCompetenceParam,
      externallyFunded,
      projectName,
      projectEndDate,
      projectTasks,
      externallyFoundedResearcher,
      substituteAdvertised,
      substituteTypeGroupValue,
      substituteFor,
      workDescription,
      additionalDuty,
      termEmployee,
      karrierefremmendeArbeid,
      termAmount,
      abroardEmployeeText,
      mscaBox,
      mobility,
      family,
      frameProgram,
      grantNumber);
  }
}


function getArbeidsavtaleBodyEngelsk(
  midlertidigAnsatt: boolean,
  vikar: boolean,
  underviser: boolean,
  jobTitle: string,
  educationalCompetenceParam: boolean,
  norwegianCompetenceParam: boolean,
  externallyFunded: boolean,
  projectName: string,
  projectEndDate: string,
  projectTasks: string,
  externallyFoundedResearcher: boolean,
  substituteAdvertised: boolean,
  substituteTypeGroupValue: string,
  substituteFor: string,
  workDescription: string,
  additionalDuty: string,
  termEmployee: string,
  karrierefremmendeArbeid: boolean,
  karrierefremmendeArbeidMengde: string,
  abroardEmployeeText: string,
  mscaBox: boolean,
  mobility: boolean,
  family: boolean,
  frameProgram: string,
  grantNumber: string,
): string {
  let educationalCompetenceNeeded = "";
  let norwegianCompetenceNeeded = "";
  let externallyFundedText = "";
  let externallyFoundedResearcherText = "";
  let substituteNotAdvertisedText = "";
  let substituteText = "";
  let tempEmployeeText = "";
  let aremalText = "";
  let mscaText = "";
  let mobFamAllowanceText = "";
  let workText = "";

  if (mscaBox) {
    mscaText = `The position is connected to the ${frameProgram} action, under the Marie Sklodowska-Curie, regulated by EC 
    Grant Agreement No: ${grantNumber}. The researcher is obliged to work exclusively for the research training under the action. 
    The Personal Career Development Plan (PCDP) specifies the training under the Action. 
    The University of Bergen will ensure payment of allowances in accordance with the EC Grant Agreement. Payments will be made in 
    NOK according to the valuta course at payment day. Living allowance is replaced by annual salary according to basic collective agreement. 
    If needed, compliance with the EU funding rates will be ensured by corrective 
    payments following the end of the project period. `;
  }
  if (mobility || family) {
    mobFamAllowanceText = `The amounts of ${mobility ? `mobility allowance ` : ``}${mobility && family ? `and ` : ``}${family ? `family allowance ` : ``}
     specified above will be paid in addition to the monthly salary. `;
  }

  if (termEmployee != null) {
    switch (termEmployee) {
      case 'ekstraerverv':
        aremalText = `The extra duty is in addition to the main position at: ${additionalDuty}. 
    The employment is for a fixed term, cf. University and University Colleges Act § 7-7. The employment relationship ends without notice at the expiration of the fixed term, cf. Civil Servants Act § 17 (2). `;
        break;
      case 'leader':
        aremalText = `The employment is for a fixed term, cf. University and University Colleges Act § 7-6 (1) c. The employment relationship ends without notice at the expiration of the fixed term, 
            cf. Civil Servants Act § 17 (2). Any renewal of the fixed-term period occurs after a regular public announcement and employment procedure.  `
        break;
      case 'double':
        aremalText = `The employment is for a fixed term, cf. University and University Colleges Act § 7-4 (1) h). The employment relationship ends without notice at the expiration of the fixed term 
            cf. Civil Servants Act § 17 (2). A plan for the implementation of the dual competence education is included as an annex to the employment contract
            , including the distribution of working hours between doctoral education, specialist training, and career-promoting work.  
            ${karrierefremmendeArbeid ? `Career-promoting work constitutes ${karrierefremmendeArbeidMengde} of the fixed-term period. ` : ''}`
        break;
      case 'spesialistkandidat':
        aremalText = `The employment is for a fixed term, cf. University and University Colleges Act § 7-4 (1) h). The employment relationship ends without notice at the expiration of the fixed term,
             cf. Civil Servants Act § 17 (2). A plan for the implementation of the specialist training is included as an annex to the employment contract. ${karrierefremmendeArbeid ?
            `Career-promoting work constitutes ${karrierefremmendeArbeidMengde} of the fixed-term period. For appointments beyond
               two years, the institution may include other career-promoting work in the position` : ''}`
        break;
      case 'innstegsstilling':
        aremalText = `The employment is for a fixed term, cf. University and University Colleges Act § 7-6 (1) e. cf. regulation on employment on entry terms. To obtain permanent employment, the
             requirements in the guidelines for the use of entry positions at UiB sec. 5.1 must be met. The faculty board decides based on the final evaluation
              whether permanent employment will be granted. If permanent employment is not granted, the employment relationship ends without notice at the expiration of the fixed term, cf.
               Civil Servants Act § 17 (2).  `
        break;
      case 'skapende':
        aremalText = `The employment is for a fixed term, cf. University and University Colleges Act § 7-6 (1) d. The employment relationship ends without notice at the expiration of the fixed term,
             cf. Civil Servants Act § 17 (2). `
        break;
      case 'postdoktor':
        aremalText = `The employment is for a fixed term, cf. University and University Colleges Act § 7-6 (1) f. The employment relationship ends without notice at the expiration of the fixed term,
             cf. Civil Servants Act § 17 (2). ${karrierefremmendeArbeid ? `Career-promoting work constitutes ${karrierefremmendeArbeidMengde} of the fixed-term period. Refer to your specific career plan.` : ''} `
        break;
      case 'stipendiat':
        aremalText = `The employment is for a fixed term, cf. University and University Colleges Act § 7-6 (1) g. The employment relationship ends without notice at the expiration of the fixed term, cf. Civil Servants Act
             § 17 (2). Admission to a doctoral program is a condition for taking up the position.  To become employed as a research fellow, admission to a doctoral 
             program or a binding agreement for such admission, is required. ${karrierefremmendeArbeid ? `Career-promoting work constitutes ${karrierefremmendeArbeidMengde}
                 of the fixed-term period.  Refer to your specific career plan.` : ''} The appointed person must not have any secondary employment contrary to the rules of the University of Bergen or government rules.
                  Rights to research and work results are governed by the Regulation on handling employees' rights to the results of work and research at the University of Bergen.`
        break;
      case 'kunstnerisk':
        aremalText = `The employment is for a fixed term, cf. University and University Colleges Act § 7-6 (1) g. The employment relationship ends without notice at the expiration of the fixed term, cf.
             Civil Servants Act § 17 (2).  The employment is associated with the Scholarship Program for Artistic Development Work. ${karrierefremmendeArbeid ?
            `Career-promoting work constitutes ${karrierefremmendeArbeidMengde} of the fixed-term period. Refer to your specific career plan.` : ''} The appointed person must not have any secondary employment contrary to the rules of the University of Bergen or
             government rules. Rights to research and work results are governed by the Regulation on handling employees' rights to the results of work and research at the University of Bergen.`
        break;
      case 'vitenskapelig':
        aremalText = `The employment is for a fixed term, cf. University and University Colleges Act § 7-4 (1) i. The employment relationship ends without notice at the expiration of the fixed term,
             cf. Civil Servants Act § 17 (2). `
        break;
      default:
        console.error('This should not happen! Please check the termType value.');
        break;
    }
  }

  if(workDescription != null){
    workText = `Description of the work: ${workDescription}.`;
  }
  if (midlertidigAnsatt && !underviser) {
    tempEmployeeText = `The work to be performed is of a temporary nature, cf. the Civil Servants Act § 9 (1) a.  
    ${workText} The employment relationship terminates at the end of the agreed period in accordance with the Civil Servants Act § 17 (1). `;
  }
  else if (midlertidigAnsatt && underviser) {
    tempEmployeeText = `The employment is temporary to cover teaching needs in the advertised position pursuant to the University and University Colleges Act § 7-3.  
    ${workText} The employment relationship ends without notice upon the expiration of the employment period.  `;
  }

  if (educationalCompetenceParam) {
    educationalCompetenceNeeded =
      "It is a prerequisite for employment that educational competence is achieved within two years of commencement. ";
  }
  if (norwegianCompetenceParam) {
    norwegianCompetenceNeeded =
      "It is a prerequisite for employment that Norwegian language skills at a minimum level of B2 are documented within three years of commencement. ";
  }
  if (externallyFunded) {
    externallyFundedText = `The employment is associated with an externally funded project: ${projectName},
 with an expected conclusion ${projectEndDate}. Description of the employee's tasks: ${projectTasks}. `;
  }
  if (externallyFoundedResearcher) {
    externallyFoundedResearcherText = `Upon completion of the project, continued employment is contingent upon 
  further external funding of the position. The employee is encouraged to actively participate in the application 
  process for new project funds to finance the position. `;
  }

  if (!substituteAdvertised && vikar) {
    substituteNotAdvertisedText =
      `The employment is made without advertisement and is temporary until the date of the last working day. 
      UiB reserves the right to advertise the position, should it, after employment, become evident that a substitute is required beyond (the initial) 6 months. `;
  }
  if (substituteTypeGroupValue === "pending" && vikar) {
    substituteText = `The employment relationship concerns a substitute in a vacant position pending the ordinary employment procedure, 
  cf. the Civil Servants Act § 9 (1) b.  The employment relationship is temporary and terminates without notice when the time is up, 
  or when the position holder assumes the position at an earlier date, cf. the Civil Servants Act § 17 (1). `;
  } else if (substituteTypeGroupValue === "person" && vikar) {
    substituteText = `The employment occurs in accordance with the Civil Servants Act § 9 (1) b as a substitute for: ${substituteFor}.
         The employment relationship terminates without written notice when the time is up, or when the permanent holder of the position resumes their position,
          cf. the Civil Servants Act § 17 (1). `;
  } else if (substituteTypeGroupValue === "many" && vikar) {
    substituteText = `The employment occurs in accordance with the Civil Servants Act § 9 (1) b in the substitute position concerning: ${substituteFor}.
         The employment relationship terminates without written notice when the time is up, or when the permanent holder of the position resumes their position,
          cf. the Civil Servants Act § 17 (1). `;
  }

  let bodyIntro =
    `<p class="MsoNormal" style="font-size: 11pt;">` +
    mscaText +
    mobFamAllowanceText +
    tempEmployeeText +
    educationalCompetenceNeeded +
    aremalText +
    norwegianCompetenceNeeded +
    externallyFundedText +
    externallyFoundedResearcherText +
    substituteText +
    substituteNotAdvertisedText +
    abroardEmployeeText +
    "</p>";




  return `
    ${bodyIntro}
        <p class="MsoNormal" style="font-size: 11pt;">
The employment contract, along with any job advertisement text, 
            constitutes the terms of employment at the time of commencement. The employment is subject to 
            compliance with the regulations that apply to the position at any given time.  
            General salary and working conditions are governed by the Main Collective Agreement in the state (HTA). 
            Furthermore, the employment relationship is regulated by the Civil Servants Act, 
            the Working Environment Act (WEA), the Universities and Colleges Act (UCA), the National Insurance Act, 
            the Act on the Government Pension Fund, the Act on Age Limits for Public Servants, 
            the Dispute Act, the Main Agreement in the state (HA) with Adaptation Agreement at UiB, 
            personnel regulations, and any special agreements and guidelines applicable to the position.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
Salary is paid on the 12th of each month via bank transfer, unless otherwise specifically agreed. 
            A 2% pension contribution is deducted for membership in the Government Pension Fund for positions with a minimum of 20 percent of a full position. 
            The state and the main unions have through a special agreement stipulated that employees in a 100% position shall be deducted NOK 400,- in gross salary per year, 
            which is part of the co-financing of training and development measures.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            The rules in the Civil Servants Act § 15 regarding probationary period apply. The probationary period is 6 months from the date of commencement. Except for positions with a duration of less than 1 year, where the probationary period will be half of the employment period.
            If the employee has been absent from work during the probationary period, the employer may extend the probationary period by a period corresponding to the length of the absence.
            </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Working hours and the length of breaks follow the rules in the Working Environment Act (WEA), the Main Collective Agreement in the state (HTA), and special agreements. 
            The ordinary working hours shall on average not exceed 37.5 hours per week in a 100% position. 
            Working hours should, as far as possible, be placed between 07:00 and 17:00 and distributed over 5 days per week.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Right to vacation and vacation pay is regulated in accordance with the Holiday Act, the Main Collective Agreement in the state (HTA), and special agreements. 
            The rules for determining the vacation period follow from the Holiday Act § 6. The employee may demand that the main vacation, which includes three weeks, 
            is given during the main vacation period from June 1 to September 30. 
            However, this does not apply to employees who join after August 15 in the vacation year. 
            Employees are obliged to take vacation and must apply for the desired vacation period according to UiB's routines. 
            To motivate older employees to stay longer in employment, according to the HTA, currently 
            leave with pay equivalent to 10 days per year is given from the calendar year one turns 62 years old.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Employees are entitled to full pay during illness for up to one year, leave for pregnancy, childbirth, adoption, and breastfeeding, and for a child's illness in accordance with HTA §§ 18.- 20. 
            When important welfare and care reasons exist, an employee may be granted welfare leave with pay for up to 12 working days. 
            Employees are allowed necessary short-term absence during working hours, e.g., 
            short visits to the doctor or dentist. The short-term absence must be clarified with the immediate superior.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            UiB offers competence development in accordance with the Main Agreement (HA) with adaptation agreement, special agreement, and internal guidelines.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            For the employment relationship, the notice periods in the Civil Servants Act § 22 apply. 
            Employees must submit their resignation in writing. In case of termination by the employer, reference is made to the procedural rules in the Civil Servants Act § 32.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
        Employees must not hold additional positions or other employment in conflict with the rules of the state. Some employee groups must register their additional positions in accordance with guidelines at UiB.
        Rights to research and work results are regulated in the Regulations for managing employees' rights to research and work results at the University of Bergen.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Employees at UiB are subject to confidentiality according to the Public Administration Act, and any special confidentiality rules that apply to the position. 
            By signing the employment contract, the employee declares to be aware of and respect the rules on confidentiality.
        </p>
    `;
}

function getArbeidsavtaleBodyNorsk(
  midlertidigAnsatt: boolean,
  vikar: boolean,
  underviser: boolean,
  jobTitle: string,
  educationalCompetenceParam: boolean,
  norwegianCompetenceParam: boolean,
  externallyFunded: boolean,
  projectName: string,
  projectEndDate: string,
  projectTasks: string,
  externallyFoundedResearcher: boolean,
  substituteAdvertised: boolean,
  substituteTypeGroupValue: string,
  substituteFor: string,
  workDescription: string,
  additionalDuty: string,
  termEmployee: string,
  karrierefremmendeArbeid: boolean,
  karrierefremmendeArbeidMengde: string,
  abroardEmployeeText: string,
  mscaBox: boolean,
  mobility: boolean,
  family: boolean,
  frameProgram: string,
  grantNumber: string,
): string {
  let educationalCompetenceNeeded = "";
  let norwegianCompetenceNeeded = "";
  let externallyFundedText = "";
  let externallyFoundedResearcherText = "";
  let substituteNotAdvertisedText = "";
  let substituteText = "";
  let tempEmployeeText = "";
  let aremalText = "";
  let mscaText = "";
  let mobFamAllowanceText = "";
  let workText = "";

  if (mscaBox) {
    mscaText = `Stillingen er knyttet til ${frameProgram}-aksjonen, under Marie Sklodowska-Curie, regulert av EFs tilskuddsavtale 
    nr. ${grantNumber}. Forskeren er forpliktet til å arbeide eksklusivt med forskerutdanningen under tiltaket. 
    Den personlige karriereutviklingsplanen spesifiserer opplæringen under action. 
    Universitetet i Bergen vil sørge for utbetaling av tillegg i samsvar med EUs tilskuddsavtale. Utbetalinger vil bli gjort i 
    NOK i henhold til valutakursen på betalingsdagen. Levegodtgjørelsen erstattes av årslønn i henhold til grunnleggende tariffavtale. 
    Om nødvendig, vil overensstemmelse med EUs finansieringssatser sikres ved 
    korrektive betalinger etter prosjektperiodens slutt.`;
  }
  if (mobility || family) {
    mobFamAllowanceText = `Beløpene for ${mobility ? `mobilitetstillegg ` : ``}${mobility && family ? `og ` : ``}${family ? `familiestønad ` : ``}
     som er spesifisert ovenfor, vil bli utbetalt i tillegg til månedslønnen. `;
  }

  if (termEmployee != null) {
    switch (termEmployee) {
      case 'ekstraerverv':
        aremalText = `Ekstraervervet kommer i tillegg til hovedstilling ved: ${additionalDuty}. 
    Ansettelsen er på åremål, jf. uhl. § 7-7. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp, jf. statsansatteloven § 17 (2). `;
        break;
      case 'leader':
        aremalText = `Ansettelsen er på åremål, jf. uhl. § 7-6 (1) c. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp, 
            jf. statsansattelovens § 17 (2).  Eventuell fornyelse av åremålsperiode skjer etter vanlig offentlig kunngjøring og ansettelsesprosedyre.  `
        break;
      case 'double':
        aremalText = `Ansettelsen er på åremål, jf. uhl. § 7-4 (1) h). Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp 
            jf. statsansatteloven § 17 (2).  Plan for gjennomføring av dobbelkompetanseutdanningen inngår som vedlegg til arbeidskontrakten,
             herunder fordeling av arbeidstiden mellom doktorgradsutdanning, spesialistutdanning og karrierefremmende arbeid.  
            ${karrierefremmendeArbeid ? `Karrierefremmende arbeid utgjør ${karrierefremmendeArbeidMengde} av åremålsperioden. ` : ''}`
        break;
      case 'spesialistkandidat':
        aremalText = `Ansettelsen er på åremål, jf. uhl. § 7-4 (1) h). Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp,
             jf. statsansatteloven § 17 (2).  Plan for gjennomføring av spesialistutdanningen inngår som vedlegg til arbeidskontrakten. ${karrierefremmendeArbeid ?
            `Karrierefremmende arbeid utgjør ${karrierefremmendeArbeidMengde} av åremålsperioden. Ved ansettelse utover
               to år kan institusjonen inkludere annet karrierefremmende arbeid i stillingen` : ''}`
        break;
      case 'innstegsstilling':
        aremalText = `Ansettelsen er på åremål, jf. uhl. § 7-6 (1) e.  jf. forskrift om ansettelse på innstegsvilkår. For å få fast ansettelse må
             kravene i retningslinjer for bruk av innstegsstillinger ved UiB pkt. 5.1 være oppfylt. Fakultetsstyret avgjør med utgangspunkt i sluttevalueringen
              om fast ansettelse skal gis. Gis ikke fast ansettelse, opphører ansettelsesforholdet uten oppsigelse ved åremålsperiodens utløp, jf.
               statsansatteloven § 17 (2).  `
        break;
      case 'skapende':
        aremalText = `Ansettelsen er på åremål, jf. uhl. § 7-6 (1) d. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp,
             jf. statsansatteloven § 17 (2). `
        break;
      case 'postdoktor':
        aremalText = `Ansettelsen er på åremål, jf. uhl § 7-6 (1) f. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp,
             jf. statsansatteloven § 17 (2). ${karrierefremmendeArbeid ? `Karrierefremmende arbeid utgjør ${karrierefremmendeArbeidMengde} av åremålsperioden, hendvis til din karriereplan.` : ''} `
        break;
      case 'stipendiat':
        aremalText = `Ansettelsen er på åremål, jf. uhl § 7-6 (1) g. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp, jf. statsansatteloven
             § 17 (2). Opptak til doktorgradsprogram er et vilkår for tiltredelse i stillingen.  For å bli ansatt som stipendiat kreves opptak i et doktorgradsprogram,
              eller at det foreligger en forpliktende avtale om opptak. ${karrierefremmendeArbeid ? `Karrierefremmende arbeid utgjør ${karrierefremmendeArbeidMengde}
                 av åremålsperioden, hendvis til din karriereplan.` : ''} Ansatte må ikke inneha sidegjøremål i strid med reglene ved UiB eller i staten. Rettigheter 
                 til forsknings- og arbeidsresultater er regulert i Reglement om håndtering av ansattes rettigheter til forsknings- og arbeidsresultater ved Universitetet i Bergen.`
        break;
      case 'kunstnerisk':
        aremalText = `Ansettelsen er på åremål, jf. uhl § 7-6 (1) g. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp, jf.
             statsansatteloven § 17 (2).  Ansettelsen er knyttet til Stipendprogram for kunstnerisk utviklingsarbeid. ${karrierefremmendeArbeid ?
            `Karrierefremmende arbeid utgjør ${karrierefremmendeArbeidMengde} av åremålsperioden, hendvis til din karriereplan.` : ''} Ansatte må ikke inneha sidegjøremål i
             strid med reglene ved UiB eller i staten. Rettigheter til forsknings- og arbeidsresultater er regulert i Reglement om håndtering av ansattes 
             rettigheter til forsknings- og arbeidsresultater ved Universitetet i Bergen.`
        break;
      case 'vitenskapelig':
        aremalText = `Ansettelsen er på åremål, jf. uhl. § 7-4 (1) i. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp,
             jf. statsansatteloven § 17 (2). `
        break;
      default:
        console.error('This should not happen! Please check the termType value.');
        break;
    }}
  

  if(workDescription != null){
    workText = `Beskrivelse av arbeidet: ${workDescription}.`;
  }

  if (midlertidigAnsatt && !underviser) {
    tempEmployeeText = `Arbeidet som skal utføres er av midlertidig karakter, jf. statsansatteloven § 9 (1) a.  
    ${workText} Ansettelsesforholdet opphører ved det avtalte tidsrommets utløp iht. statsansatteloven § 17 (1). `;
  }
  else if (midlertidigAnsatt && underviser) {
    tempEmployeeText = `Ansettelsen er midlertidig for å dekke undervisningsbehov i den utlyste stillingen i henhold til uhl. § 7-3.  
    ${workText} Ansettelsesforholdet opphører uten oppsigelse når ansettelsesperioden er utløpt.  `;
  }

  if (educationalCompetenceParam) {
    educationalCompetenceNeeded =
      "Det er en forutsetning for ansettelsen at utdanningsfaglig kompetanse oppnås innen to år etter tiltredelsen. ";
  }
  if (norwegianCompetenceParam) {
    norwegianCompetenceNeeded =
      "Det er en forutsetning for ansettelsen at det dokumenteres norskferdigheter på minimum nivå B2 innen tre år etter tiltredelsen. ";
  }
  if (externallyFunded) {
    externallyFundedText = `Ansettelsesforholdet er knyttet til eksternt finansiert oppdrag i prosjektet:  ${projectName},
 med antatt avslutning ${projectEndDate}. Beskrivelse av arbeidstakers oppgaver: ${projectTasks}. `;
  }
  if (externallyFoundedResearcher) {
    externallyFoundedResearcherText = `Ved avslutning av prosjektet forutsettes fortsatt ansettelse av videre 
  ekstern finansiering av stillingen. Den ansatte oppfordres til å ta aktiv del i arbeidet med søknader om f
  nye prosjektmidler til finansiering av stillingen. `;
  }

  if (!substituteAdvertised && vikar) {
    substituteNotAdvertisedText =
      `Ansettelsen er foretatt uten utlysing og er tidsbegrenset til dato for siste arbeidsdag. 
      Dersom det etter ansettelse viser seg at det er behov for vikar ut over 6 måneder, tas det forbehold om at stillingen vil bli lyst ut. `;
  }
  if (substituteTypeGroupValue === "pending" && vikar) {
    substituteText = `Ansettelsesforholdet gjelder vikariat i ledig stilling i påvente av ordinær ansettelsesprosedyre, 
  jf. statsansatteloven § 9 (1) b.  Ansettelsesforholdet er tidsbegrenset og opphører uten oppsigelse når tiden er ute, 
  eller når stillingsinnehaver tiltrer stillingen på et tidligere tidspunkt, jf. statsansatteloven § 17 (1). `;
  } else if (substituteTypeGroupValue === "person" && vikar) {
    substituteText = `Ansettelsen skjer i henhold til statsansatteloven § 9 (1) b som vikar for: ${substituteFor}.
         Ansettelsesforholdet opphører uten skriftlig oppsigelse når tiden er ute, eller når stillingens faste innehaver gjeninntrer i stillingen,
          jf. statsansattelovens § 17 (1). `;
  } else if (substituteTypeGroupValue === "many" && vikar) {
    substituteText = `Ansettelsen skjer i henhold til statsansatteloven § 9 (1) b i vikariatet som gjelder: ${substituteFor}.
         Ansettelsesforholdet opphører uten skriftlig oppsigelse når tiden er ute, eller når stillingens faste innehaver gjeninntrer i stillingen,
          jf. statsansattelovens § 17 (1). `;
  }

  let bodyIntro =
    `<p class="MsoNormal" style="font-size: 11pt;">` +
    mscaText +
    mobFamAllowanceText +
    tempEmployeeText +
    educationalCompetenceNeeded +
    aremalText +
    norwegianCompetenceNeeded +
    externallyFundedText +
    externallyFoundedResearcherText +
    substituteText +
    substituteNotAdvertisedText +
    abroardEmployeeText +
    "</p>";

  return `
    ${bodyIntro}
        <p class="MsoNormal" style="font-size: 11pt;">
            Arbeidsavtalen inneholder, sammen med eventuell utlysningstekst, 
            ansettelsesvilkårene ved tiltredelsen. Ansettelsen skjer med plikt 
            til å rette seg etter de bestemmelser som til enhver tid gjelder for stillingen.  
            Generelle lønns- og arbeidsvilkår reguleres av Hovedtariffavtalen i staten (HTA). 
            For øvrig er ansettelsesforholdet blant annet regulert av statsansatteloven, 
            arbeidsmiljøloven (aml), universitets- og høyskoleloven (uhl), folketrygdloven, 
            Lov om Statens pensjonskasse, Lov om aldersgrenser for offentlige tjenestemenn m.fl., 
            tjenestetvistloven, Hovedavtalen i staten (HA) med Tilpasningsavtale ved UiB, 
            personalreglement samt eventuelle særavtaler og retningslinjer som gjelder for stillingen. 
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Lønn utbetales den 12. hver måned via bank, med mindre annet er avtalt særskilt. 
            Det trekkes 2% pensjonsinnskudd til medlemskap i Statens pensjonskasse for stillinger med minimum 20 prosent av full stilling. 
            Staten og hovedsammenslutningene har gjennom særavtale fastsatt at arbeidstakere i 100 % stilling skal trekkes kr 400,- i bruttolønn pr år, 
            som inngår i delfinansiering av opplærings- og utviklingstiltak.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Reglene i statsansatteloven § 15 om prøvetid gjelder. Prøvetiden er 6 måneder fra tiltredelse. Med unntak av stillinger ved varighet under 1 år, hvor prøvetiden vil være halvparten av ansettelsesforholdets varighet.
            Dersom den ansatte har vært fraværende fra arbeidet i prøvetiden, kan arbeidsgiver forlenge prøvetiden med en periode som tilsvarer lengden av fraværet.  
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Arbeidstiden og lengden av pauser følger reglene i aml, HTA og særavtaler. 
            Den alminnelige arbeidstiden skal i gjennomsnitt ikke overstige 37,5 timer pr. uke i 100 % stilling. 
            Arbeidstiden skal i den utstrekning det er mulig, legges i tidsrommet mellom kl. 07.00 og kl. 17.00 og fordeles på 5 dager pr. uke. 
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Rett til ferie og feriepenger reguleres i henhold til ferieloven, HTA og særavtale. 
            Reglene for fastsettelse av ferietidspunktet følger av ferieloven § 6. Arbeidstaker kan kreve at hovedferie som omfatter tre uker 
            gis i hovedferieperioden 1 juni - 30 september. 
            Dette gjelder likevel ikke for arbeidstaker som tiltrer etter 15 august i ferieåret. 
            Ansatte plikter å avvikle ferie, og må søke om ønsket ferietidspunkt iht. UiB sine rutiner. 
            For å motivere eldre arbeidstakere til å stå lenger i arbeid, gis, i henhold til HTA, for tiden 
            tjenestefri med lønn tilsvarende 10 dager pr. år fra det kalenderåret man fyller 62 år.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Arbeidstaker har rett til full lønn under sykdom i inntil ett år, permisjon ved svangerskap, fødsel, adopsjon og amming, og ved barns sykdom iht. HTA §§ 18.- 20. 
            Når viktige velferds- og omsorgsgrunner foreligger, kan en arbeidstaker tilstås velferdspermisjon med lønn i inntil 12 arbeidsdager. 
            Arbeidstakere gis anledning til nødvendig korttidsfravær i arbeidstiden, f.eks. 
            korte lege- eller tannlegebesøk. Korttidsfraværet må avklares med nærmeste overordnede.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            UiB tilbyr kompetanseutvikling i henhold til HA med tilpasningsavtale, særavtale og interne retningslinjer.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            For ansettelsesforholdet gjelder oppsigelsesfrister i statsansatteloven § 22. 
            Ansatte må levere sin oppsigelse skriftlig. Ved oppsigelse fra arbeidsgiver vises det til saksbehandlingsreglene i statsansatteloven § 32.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
        Ansatte må ikke inneha ekstraerverv eller annet erverv i strid med reglene i staten. Noen ansattgrupper må registrere sine ekstraerverv i henhold til retningslinjer ved UiB. 
        Rettigheter til forsknings- og arbeidsresultater er regulert i Reglement om håndtering av ansattes rettigheter til forsknings- og arbeidsresultater ved Universitetet i Bergen.
        </p>
        <p class="MsoNormal" style="font-size: 11pt;">
            Ansatte ved UiB har taushetsplikt etter forvaltningsloven, og eventuelt særlige taushetspliktsregler som gjelder for stillingen. 
            Ved å underskrive arbeidskontrakten erklærer den ansatte å kjenne til og respekterer reglene om taushetsplikt.
        </p>
    `;
  }
