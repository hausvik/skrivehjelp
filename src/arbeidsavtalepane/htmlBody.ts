
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
  additionalDuty:string,
  termEmployee: string,
  karrierefremmendeArbeid: boolean,
  termAmount: string,
  abroardEmployeeText: string,
): string {
  if(engelsk){
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
    abroardEmployeeText);
  }
  else{
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
      abroardEmployeeText);
  }
}


function getArbeidsavtaleBodyEngelsk(
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
  additionalDuty:string,
  termEmployee: string,
  karrierefremmendeArbeid: boolean,
  termAmount: string,
  abroardEmployeeText: string,
): string {
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
    abroardEmployeeText

  );
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
  additionalDuty:string,
  termEmployee: string,
  karrierefremmendeArbeid: boolean,
  karrierefremmendeArbeidMengde: string,
  abroardEmployeeText: string,
): string {
  let educationalCompetenceNeeded = "";
  let norwegianCompetenceNeeded = "";
  let externallyFundedText = "";
  let externallyFoundedResearcherText = "";
  let substituteNotAdvertisedText = "";
  let substituteText = "";
  let tempEmployeeText = "";
  let aremalText = '';


if (termEmployee != null) {
    switch (termEmployee) {
        case 'ekstraverv':
            aremalText = `Ekstraervervet kommer i tillegg til hovedstilling ved: ${additionalDuty}. 
    Ansettelsen er på åremål, jf. uhl. § 7-7. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp, jf. statsansatteloven § 17 (2). `;
            break;
        case 'leader':
            aremalText = `Ansettelsen er på åremål, jf. uhl. § 7-6 (1) c. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp, 
            jf. statsansattelovens § 17 (2).  Eventuell fornyelse av åremålsperiode skjer etter vanlig offentlig kunngjøring og ansettelsesprosedyre.  `
            break;
        case 'dobbelkompetanseutdanning':
            aremalText = `Ansettelsen er på åremål, jf. uhl. § 6-4 (1) h). Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp 
            jf. statsansatteloven § 17 (2).  Plan for gjennomføring av dobbelkompetanseutdanningen inngår som vedlegg til arbeidskontrakten
            , herunder fordeling av arbeidstiden mellom doktorgradsutdanning, spesialistutdanning og karrierefremmende arbeid.  
            ${karrierefremmendeArbeid ? `Karrierefremmende arbeid utgjør ${karrierefremmendeArbeidMengde} av åremålsperioden. ` : ''}`
            break;
        case 'spesialistkandidat':
            aremalText = `Ansettelsen er på åremål, jf. uhl. § 6-4 (1) h). Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp,
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
             jf. statsansatteloven § 17 (2). ${karrierefremmendeArbeid ? `Karrierefremmende arbeid utgjør ${karrierefremmendeArbeidMengde} av åremålsperioden.` : ''} `
            break;
        case 'stipendiat':
            aremalText = `Ansettelsen er på åremål, jf. uhl § 7-6 (1) g. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp, jf. statsansatteloven
             § 17 (2). Opptak til doktorgradsprogram er et vilkår for tiltredelse i stillingen.  For å bli ansatt som stipendiat kreves opptak i et doktorgradsprogram,
              eller at det foreligger en forpliktende avtale om opptak. ${karrierefremmendeArbeid ? `Karrierefremmende arbeid utgjør ${karrierefremmendeArbeidMengde}
                 av åremålsperioden. Vise til karriereplan som spesifiserer den kompetansen som postdoktoren skal opparbeide seg.` : ''}`
            break;
        case 'kunstnerisk':
            aremalText = `Ansettelsen er på åremål, jf. uhl § 7-6 (1) g. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp, jf.
             statsansatteloven § 17 (2).  Ansettelsen er knyttet til Stipendprogram for kunstnerisk utviklingsarbeid. ${karrierefremmendeArbeid ? 
              `Karrierefremmende arbeid utgjør ${karrierefremmendeArbeidMengde} av åremålsperioden. Vise til karriereplan som spesifiserer den kompetansen
               som postdoktoren skal opparbeide seg.` : ''}`
            break;
        case 'vitenskapelig':
            aremalText = `Ansettelsen er på åremål, jf. uhl. § 6-4 (1) i. Ansettelsesforholdet opphører uten oppsigelse ved åremålsperiodens utløp,
             jf. statsansatteloven § 17 (2). `
            break;
        default:
            console.log('This should not happen! Please check the termType value.');
            break;
    }
}

  if (midlertidigAnsatt && !underviser) {
    tempEmployeeText = `Arbeidet som skal utføres er av midlertidig karakter, jf. statsansatteloven § 9 (1) a.  
    Beskrivelse av arbeidet: ${workDescription}. Ansettelsesforholdet opphører ved det avtalte tidsrommets utløp iht. statsansatteloven § 17 (1). `;
  }
  else if (midlertidigAnsatt && underviser) {
    tempEmployeeText = `Ansettelsen er midlertidig for å dekke undervisningsbehov i den utlyste stillingen som ${jobTitle} i henhold til. til uhl. § 7-3.  
    Ansettelsesforholdet opphører uten oppsigelse når ansettelsesperioden er utløpt.  `;
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
  ekstern finansiering av stillingen. Den ansatte oppfordres til å ta aktiv del i arbeidet med søknader om 
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
    "<p>" +
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
        <p>
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
        <p>
            Lønn utbetales den 12. hver måned via bank, med mindre annet er avtalt særskilt. 
            Det trekkes 20% pensjonsinnskudd til medlemskap i Statens pensjonskasse for stillinger med minimum 20 prosent av full stilling. 
            Staten og hovedsammenslutningene har gjennom særavtale fastsatt at arbeidstakere i 100 % stilling skal trekkes kr 400,- i bruttolønn pr år, 
            som inngår i delfinansiering av opplærings- og utviklingstiltak, 
        </p>
        <p>
            Reglene i statsansatteloven § 15 om prøvetid gjelder. Prøvetiden er 6 måneder fra tiltredelse.
            Dersom den ansatte har vært fraværende fra arbeidet i prøvetiden, kan arbeidsgiver forlenge prøvetiden med en periode som tilsvarer lengden av fraværet.  
        </p>
        <p>
            Arbeidstiden og lengden av pauser følger reglene i aml, HTA og særavtaler. 
            Den alminnelige arbeidstiden skal i gjennomsnitt ikke overstige 37,5 timer pr. uke i 100 % stilling. 
            Arbeidstiden skal i den utstrekning det er mulig, legges i tidsrommet mellom kl. 07.00 og kl. 17.00 og fordeles på 5 dager pr. uke. 
        </p>
        <p>
            Rett til ferie og feriepenger reguleres i henhold til ferieloven, HTA og særavtale. 
            Reglene for fastsettelse av ferietidspunktet følger av ferieloven § 6. Arbeidstaker kan kreve at hovedferie som omfatter tre uker 
            gis i hovedferieperioden 1 juni - 30 september. 
            Dette gjelder likevel ikke for arbeidstaker som tiltrer etter 15 august i ferieåret. 
            Ansatte plikter å avvikle ferie, og må søke om ønsket ferietidspunkt iht. UiB sine rutiner. 
            For å motivere eldre arbeidstakere til å stå lenger i arbeid, gis, i henhold til HTA, for tiden 
            tjenestefri med lønn tilsvarende 10 dager pr. år fra det kalenderåret man fyller 62 år.
        </p>
        <p>
            Arbeidstaker har rett til full lønn under sykdom i inntil ett år, permisjon ved svangerskap, fødsel, adopsjon og amming, og ved barns sykdom iht. HTA §§ 18.- 20. 
            Når viktige velferds- og omsorgsgrunner foreligger, kan en arbeidstaker tilstås velferdspermisjon med lønn i inntil 12 arbeidsdager. 
            Arbeidstakere gis anledning til nødvendig korttidsfravær i arbeidstiden, f.eks. 
            korte lege- eller tannlegebesøk. Korttidsfraværet må avklares med nærmeste overordnede.
        </p>
        <p>
            UiB tilbyr kompetanseutvikling i henhold til HA med tilpasningsavtale, særavtale og interne retningslinjer.
        </p>
        <p>
            For ansettelsesforholdet gjelder oppsigelsesfrister i statsansatteloven § 22. 
            Ansatte må levere sin oppsigelse skriftlig. Ved oppsigelse fra arbeidsgiver vises det til saksbehandlingsreglene i statsansatteloven § 32.
        </p>
        <p>
            Ansatte må ikke inneha ekstraerverv og annet erverv i strid i staten. Noen ansatte må registrere sine ekstraerverv i henhold til retningslinjer ved UiB. 
            Rettigheter til forsknings- og arbeidsresultater er regulert i Reglement om håndtering av ansattes rettigheter 
            til forsknings- og arbeidsresultater ved Universitetet i Bergen.
        </p>
        <p>
            Ansatte ved UiB har taushetsplikt etter forvaltningsloven, og eventuelt særlige taushetspliktsregler som gjelder for stillingen. 
            Ved å underskrive arbeidskontrakten erklærer den ansatte å kjenne til og respekterer reglene om taushetsplikt.
        </p>
    `;
}
