/**
 * Interface for the body of the document.
 *
 * @property {boolean} tempEmployeeChecked - Indicates if the temporary employee checkbox is checked.
 * @property {boolean} substituteEmployeeChecked - Indicates if the substitute employee checkbox is checked.
 * @property {boolean} teachingPosBoxChecked - Indicates if the teaching position checkbox is checked.
 * @property {string} jobTitle - The job title.
 * @property {string} educationalCompetence - The selected value for educational competence.
 * @property {string} norwegianCompetence - The selected value for Norwegian competence.
 * @property {boolean} externallyFundedBoxChecked - Indicates if the externally funded checkbox is checked.
 * @property {string} externallyFundedProjectName - The name of the externally funded project.
 * @property {string} externallyFundedEndDate - The end date of the externally funded project.
 * @property {string} externallyFundedTasks - The tasks for the externally funded project.
 * @property {boolean} externallyFoundedResearcher - Indicates if the researcher is externally founded.
 * @property {boolean} substituteAdvertisedChecked - Indicates if the substitute is advertised.
 * @property {string} substituteTypeGroupValue - The selected value for the type of substitute.
 * @property {string} substituteFor - The person for whom the substitute is for.
 * @property {string} workDescriptionText - The description of the work.
 * @property {string} additionalDutyText - The additional duties.
 * @property {string} termType - The selected term type.
 * @property {boolean} mandatoryWorkChecked - Indicates if the mandatory work checkbox is checked.
 * @property {string} mandatoryWorkAmountText - The amount of mandatory work.
 */
export interface BodyInterface {
  tempEmployeeChecked: boolean;
  substituteEmployeeChecked: boolean;
  teachingPosBoxChecked: boolean;
  jobTitle: string;
  educationalCompetence: string;
  norwegianCompetence: string;
  externallyFundedBoxChecked: boolean;
  externallyFundedProjectName: string;
  externallyFundedEndDate: string;
  externallyFundedTasks: string;
  externallyFoundedResearcher: boolean;
  substituteAdvertisedChecked: boolean;
  substituteTypeGroupValue: string;
  substituteFor: string;
  workDescriptionText: string;
  additionalDutyText: string;
  termType: string;
  mandatoryWorkChecked: boolean;
  mandatoryWorkAmountText: string;
}