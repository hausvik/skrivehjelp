/**
 * Interface representing an employment contract.
 * @interface
 * @property {string} name - The name of the employee.
 * @property {string} personalId - The personal ID of the employee.
 * @property {string} placeOfWork - The place of work for the employee.
 * @property {string} positionCode - The code representing the position of the employee.
 * @property {string} percentageFullTime - The percentage of full-time work the employee is contracted for.
 * @property {string} salaryRange - The salary range for the employee's position.
 * @property {string} seniority - The seniority level of the employee in public service.
 * @property {string} annualSalary - The annual salary of the employee.
 * @property {string} mobilityAllowance - The mobility allowance for the employee.
 * @property {string} familyAllowance - The family allowance for the employee.
 * @property {string} startingDate - The starting date of the employment contract.
 * @property {string} endDate - The end date of the employment contract.
 */
export interface Arbeidsavtaleheader {
  name: string;
  personalId: string;
  placeOfWork: string;
  positionCode: string;
  percentageFullTime: string;
  seniority: string;
  annualSalary: string;
  mobilityAllowance: string;
  familyAllowance: string;
  startingDate: string;
  endDate: string;
}
