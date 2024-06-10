import * as XLSX from 'xlsx';

interface Position {
  SKO: string;
  Norsk: string;
  Engelsk: string;
  NorskStillingsbetegnelse: string;
  EngelskStillingsbetegnelse: string;
  Kategori: string;
}

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