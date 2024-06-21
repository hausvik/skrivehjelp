import { Workbook } from "exceljs";
import fetch from "node-fetch";

export async function readExcel(url: string): Promise<any[]> {
  // Fetch the Excel file
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // Parse the Excel file
  const workbook = new Workbook();
  await workbook.xlsx.load(new Uint8Array(arrayBuffer));

  // Get the first worksheet
  const worksheet = workbook.worksheets[0];

  // Get headers from the first row
  let headers: string[] = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber - 1] = cell.text;
  });

  // Map each row to an object using headers as keys
  const data: any[] = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      let rowData: any = {};
      row.eachCell((cell, colNumber) => {
        rowData[headers[colNumber - 1]] = cell.text;
      });
      data.push(rowData);
    }
  });

  return data;
}

/**
 * Reads data from an Excel file and adds it to a dropdown.
 * @param {string} filePath - The path to the Excel file.
 * @param {string} elementId - The id of the dropdown element.
 * @returns {Promise<T[]>} - A promise that resolves to an array of data.
 */
export async function addToDropDown<T extends { Norsk: string, Undervisning: string }>(filePath: string, elementId: string): Promise<T[]> {
  let data: T[] = await readExcel(filePath);

  let selectElement: HTMLSelectElement | null = document.getElementById(elementId) as HTMLSelectElement;

  // Populate the select element with the data
  data.forEach((item: T, index: number) => {
    // Ignore the first element
    if (index === 0) return;
    // Create a new option element
    let option = document.createElement("option");

    // Set the value and text of the option element
    option.value = item.Norsk;
    option.text = item.Norsk;

    // Add the option element to the select element
    selectElement.add(option);
  });

  return data;
}

type PositionCode = {
  SKO: string;
  Norsk: string;
  Engelsk: string;
  norJobTitle: string;
  engJobTitle: string;
  Kategori: string;
  Undervisning: string;
};

export function updateDropDown(selectElement: HTMLSelectElement, positionCodes: PositionCode[]): void {
  // Clear existing options
  selectElement.innerHTML = '';

  // Create and add a blank option at the start
  let blankOption = document.createElement("option");
  blankOption.value = '';
  blankOption.text = '';
  selectElement.add(blankOption);

  // Populate the select element with the data
  positionCodes.forEach((item: PositionCode) => {
    // Create a new option element
    let option = document.createElement("option");

    // Set the value and text of the option element
    option.value = item.Norsk;
    option.text = item.Norsk;

    // Add the option element to the select element
    selectElement.add(option);
  });
}