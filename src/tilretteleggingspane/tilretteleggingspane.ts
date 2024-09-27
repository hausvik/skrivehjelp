import { newPane } from '../taskpane/taskpane';

interface HtmlFile {
  name: string;
  path: string;
}

/**
 * Initializes the standard text pane by fetching HTML files and creating buttons for each file.
 * The buttons are added to the button container and are styled with specific classes.
 */
export async function initializeStandardtekstpane() {
  const container = document.getElementById('button-container');
  if (!container) {
    console.error('Container element not found');
    return;
  }

  try {
    const htmlFiles = await fetchHtmlFiles();
    for (const file of htmlFiles) {
      const button = document.createElement('button');
      button.textContent = extractButtonName(file.name);
      button.className = 'btn btn-primary';
      
      // Fetch the HTML content and create a paragraph element
      const tempText = await getHtmlContent(file.path); // Await the result here
      const paragraph = document.createElement('p');
      paragraph.innerText = tempText; // Assign the awaited result to innerText

      button.onclick = async () => {
        const content = await getHtmlContent(file.path);
        // Assuming you want to do something with the content on button click
        console.log(content);
      };

      container.appendChild(button);
      container.appendChild(paragraph); // Append the paragraph below the button
    }
  } catch (error) {
    console.error('Error initializing standard text pane:', error);
  }
}

/**
 * Fetches the list of HTML files from the GitLab repository.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of HTML file objects.
 */
async function fetchHtmlFiles() {
  const response = await fetch('https://git.app.uib.no/api/v4/projects/40985/repository/tree?path=_generert/C_utdanning/C.c.15%2BC.d.08%2BC.e.04_tilrettelegging');
  const files = await response.json();
  return files.filter((file: HtmlFile) => file.name.endsWith('.html'));
}

/**
 * On button click, loads the content of the specified HTML file and changes pane.
 * 
 * @param {string} filePath - The path to the HTML file to be loaded.
 * @returns {Promise<string>} The content of the HTML file.
 */
export async function getHtmlContent(filePath: string): Promise<string> {
    let fullPath = `https://git.app.uib.no/dok/standardtekster/-/raw/main/`+`${filePath}`;
    
    while (fullPath.includes('+')){
      fullPath = fullPath.replace(`+`, '%2B');
    }

  try {
    const response = await fetch(fullPath);
    const htmlContent = await response.text();
    return htmlContent; // Return the HTML content
  } catch (error) {
    console.error('Error loading HTML content:', error);

    const textExample = `<p>Vi viser til søknaden din av `+"${søknadsdato}"+` om tilrettelegging [tilretteleggingstiltak] i [evt. emnekode].</p>
                          <p>Søknaden er innvilget / Søknaden er avslått.</p>
                          <p>Du innvilges [beskrivelse].</p>`
return textExample;
  }
}

/**
 * Extracts the part of the file name between the last '-' and the '.html'.
 * 
 * @param {string} fileName - The name of the file.
 * @returns {string} The extracted part of the file name.
 */
function extractButtonName(fileName: string): string {
  let tempName = fileName.split('-');
  let returnName = tempName[1].slice(0, -5);
  return returnName.charAt(0).toUpperCase() + returnName.slice(1);
}