import fetch from "node-fetch";

interface Position {
  SKO: string;
  NorwegianTitle: string;
  EnglishTitle: string;
  TA: string;
}

export async function readCSV(): Promise<Position[]> {
  // Fetch the CSV file
  const response = await fetch("stillingskoder.csv");
  const csvFile = await response.text();

  // Split the CSV file into lines
  const lines = csvFile.split("\n");

  // Map each line to a Position object, starting from the first row (index 1)
  const positions: Position[] = lines.slice(1).map((line) => {
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
