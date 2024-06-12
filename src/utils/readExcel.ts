import { Workbook } from "exceljs";
import fetch from "node-fetch";

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
  const workbook = new Workbook();
  await workbook.xlsx.load(new Uint8Array(arrayBuffer));

  // Get the first worksheet
  const worksheet = workbook.worksheets[0];

  // Map each row to a Position object
  const positions: Position[] = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Skip header row
      positions.push({
        SKO: row.getCell(1).text,
        Norsk: row.getCell(2).text,
        Engelsk: row.getCell(3).text,
        NorskStillingsbetegnelse: row.getCell(4).text,
        EngelskStillingsbetegnelse: row.getCell(5).text,
        Kategori: row.getCell(6).text,
      });
    }
  });

  return positions;
}
