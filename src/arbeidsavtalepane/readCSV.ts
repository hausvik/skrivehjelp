import * as fs from "fs";

interface Position {
  SKO: string;
  NorwegianTitle: string;
  EnglishTitle: string;
  TA: string;
}

export function readCSV(): Position[] {
  // Read the CSV file
  const csvFile = fs.readFileSync("stillingskoder.csv", "utf8");

  // Split the CSV file into lines
  const lines = csvFile.split("\n");

  // Map each line to a Position object, starting from the first row (index 0)
  const positions: Position[] = lines.map((line) => {
    // Split the line into columns
    const columns = line.split(",");

    // Map the columns to a Position object
    const position: Position = {
      SKO: columns[0],
      NorwegianTitle: columns[1],
      EnglishTitle: columns[2],
      TA: columns[3],
    };

    return position;
  });

  return positions;
}
