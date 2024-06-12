import * as XLSX from 'xlsx';


interface Position {
  SKO: string;
  Norsk: string;
  Engelsk: string;
  NorskStillingsbetegnelse: string;
  EngelskStillingsbetegnelse: string;
  Kategori: string;
}
/**
 * Reads an Excel file and returns an array of Position objects.
 * The sorting matches the Excel-file, if we want to enforce a spesific order add another column at the end of the table in the Excel-file and sort by that.
 * @param url - The URL of the Excel file.
 * @returns {Promise<Position[]>} - A promise that resolves to an array of Position objects.
 **/
export async function readExcel(url: string): Promise<Position[]> {
  // Fetch the Excel file
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // Parse the Excel file
  const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

  // Get the first worksheet
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];

  // Convert the worksheet to JSON
  const json = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

  // Map each row to a Position object
  const positions: Position[] = json.map((row: any) => ({
    SKO: row['A'],
    Norsk: row['B'],
    Engelsk: row['C'],
    NorskStillingsbetegnelse: row['D'],
    EngelskStillingsbetegnelse: row['E'],
    Kategori: row['F'],
  }));

  return positions;
}