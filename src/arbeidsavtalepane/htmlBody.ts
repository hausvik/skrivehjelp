import { ArbeidsavtaleBody } from './bodyInterface';


export function getArbeidsavtaleBodyEngelsk(
    educationalCompetenceValue: boolean,
    norwegianCompetenceParam: boolean,
    externallyFunded: boolean,
    projectName: string,
    projectEndDate: string,
    projectTasks: string,
    externallyFoundedResearcher: boolean,

): string {
    return getArbeidsavtaleBodyNorsk(educationalCompetenceValue, norwegianCompetenceParam, externallyFunded,
        projectName, projectEndDate, projectTasks, externallyFoundedResearcher);
}

/**
 * Generates an HTML string representing the body of an employment contract, in English.
 * @function
 * @param {Arbeidsavtale} data - An object representing an employment contract.
 * @returns {string} An HTML string representing the employment contract body.
 */
export function getArbeidsavtaleBodyNorsk(
    educationalCompetenceParam: boolean,
    norwegianCompetenceParam: boolean,
    externallyFunded: boolean,
    projectName: string,
    projectEndDate: string,
    projectTasks: string,
    externallyFoundedResearcher: boolean,
): string {
    let educationalCompetenceNeeded = "";
    let norwegianCompetenceNeeded = "";
    let externallyFundedText = "";
    let externallyFoundedResearcherText = "";

    if (educationalCompetenceParam) {
        educationalCompetenceNeeded = "Det er en forutsetning for ansettelsen at utdanningsfaglig kompetanse oppnås innen to år etter tiltredelsen. "
    }
    if (norwegianCompetenceParam) {
        norwegianCompetenceNeeded = "Det er en forutsetning for ansettelsen at det dokumenteres norskferdigheter på minimum nivå B2 innen tre år etter tiltredelsen. "
    }
    if (externallyFunded) {
        externallyFundedText = "Ansettelsesforholdet er knyttet til eksternt finansiert oppdrag i prosjektet:  " + projectName +
            ", med antatt avslutning " + projectEndDate + ". Beskrivelse av arbeidstakers oppgaver: " + projectTasks;
    }
    if (externallyFoundedResearcher) {
        externallyFoundedResearcherText = "Ved avslutning av prosjektet forutsettes fortsatt ansettelse av videre ekstern finansiering av stillingen. " +
            "Den ansatte oppfordres til å ta aktiv del i arbeidet med søknader om nye prosjektmidler til finansiering av stillingen.";
    }

    let bodyIntro = "<p>" + educationalCompetenceNeeded + norwegianCompetenceNeeded + externallyFundedText + externallyFoundedResearcherText + "</p>";

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
            som inngår i delfinansiering av opplærings- og utviklingstiltak, 
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
