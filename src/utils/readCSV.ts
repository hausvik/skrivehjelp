interface Position {
  SKO: string;
  NorwegianTitle: string;
  EnglishTitle: string;
  Category: string;
}

export async function readCSV(url: string): Promise<Position[]> {
  // Fetch the CSV file
  // eslint-disable-next-line no-undef
  const response = await fetch(url);
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
      Category: columns[3],
    };

    return position;
  });

  return positions;
}
