import { newPane } from '../taskpane/taskpane';

interface HtmlFile {
  name: string;
  path: string;
}

const urlPath = 'https://ds.app.uib.no/standardtekster/dev/_generert/';

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
    const folders = await fetchFolders(urlPath, '/standardtekster/dev/');
    
    for (const folder of folders) {
      // Recursively add subfolders to the folders array
      const subfolders = await fetchSubfolders(folder, '/standardtekster/dev/_generert/');

      try {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'folder-container';
        const folderTitle = document.createElement('h3');
        folderTitle.textContent = cleanTitle(folder);
        folderDiv.appendChild(folderTitle);
      
        for (const subfolder of subfolders) {
          console.log(subfolder);
          const subFolderDiv = document.createElement('div');
          subFolderDiv.className = 'folder-container';
          const subFolderTitle = document.createElement('h4');
          subFolderTitle.textContent = cleanTitle(subfolder);
          subFolderDiv.appendChild(subFolderTitle);
      
          // Append the subFolderDiv to the folderDiv
          folderDiv.appendChild(subFolderDiv);

          // Add file buttons for subfolders
          const htmlFiles = await fetchHtmlFiles(subfolder);
          for (const file of htmlFiles) {
            if (file.name) {
              const button = document.createElement('button');
              button.textContent = extractButtonName(file.name);
              button.className = 'btn btn-primary btn-sm';

              button.onclick = async () => {
                if (file.name) {
                  const content = await getHtmlContent(subfolder, file.name);
                  newPane('dynamicpane', content, extractButtonName(file.name));
                } else {
                  console.error('File name is null');
                }
              };

              subFolderDiv.appendChild(button);
            }
          }
        }

        // Add file buttons for main folders
        const htmlFiles = await fetchHtmlFiles(folder);
        for (const file of htmlFiles) {
          if (file.name) {
            const button = document.createElement('button');
            button.textContent = extractButtonName(file.name);
            button.className = 'btn btn-primary btn-sm';

            button.onclick = async () => {
              if (file.name) {
                const content = await getHtmlContent(folder, file.name);
                newPane('dynamicpane', content, extractButtonName(file.name));
              } else {
                console.error('File name is null');
              }
            };

            folderDiv.appendChild(button);
          }
        }
        container.appendChild(folderDiv);
      } catch (error) {
        console.error('Error initializing standardtekstpane:', error);
      }
    }
  } catch (error) {
    console.error('Error fetching folders:', error);
  }

  // Add Tilbake button
  const backButton = document.createElement('button');
  backButton.textContent = 'Tilbake';
  backButton.className = 'btn btn-secondary btn-sm';
  backButton.onclick = () => newPane();
  container.appendChild(backButton);
}


/**
 * Fetches the list of folders from the specified URL.
 * 
 * @returns {Promise<Array<string>>} A promise that resolves to an array of folder names.
 */
async function fetchFolders(url: string, root?: string): Promise<Array<string>> {
  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const folderElements = doc.querySelectorAll('a');

  const folders = Array.from(folderElements)
    .map((element) => element.getAttribute('href'))
    .filter((folder): folder is string => folder !== null && folder !== root); // Ignore the root directory and filter out null values


  return folders;
}

/**
 * Fetches the list of subfolders from the specified folder.
 * 
 * @param {string} folder - The folder to fetch subfolders from.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of subfolder names.
 */
async function fetchSubfolders(folder: string, root?: string): Promise<Array<string>> {
  const fullUrl = urlPath + folder;
  const response = await fetch(fullUrl);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const folderElements = doc.querySelectorAll('a');

  const subfolders = Array.from(folderElements)
    .map((element) => element.getAttribute('href'))
    .filter((folder): folder is string => folder !== null && folder !== root && folder.endsWith('/')); // Ignore the root directory, filter out null values, and ensure it ends with a slash

  return subfolders.map(subfolder => folder + subfolder);
}

/**
 * Fetches the list of HTML files from the GitLab repository.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of HTML file objects.
 */
async function fetchHtmlFiles(folder: string) {
  const fullUrl = urlPath + folder;
  const response = await fetch(fullUrl);
  const htmlText = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const fileElements = doc.querySelectorAll('a');
  const files = Array.from(fileElements).map((element) => ({
    name: element.getAttribute('href')
  }));

  return files.filter((file) => file.name !== null && file.name.endsWith('.html'));
}

/**
 * On button click, loads the content of the specified HTML file and changes pane.
 * 
 * @param {string} filePath - The path to the HTML file to be loaded.
 * @returns {Promise<string>} The content of the HTML file.
 */
export async function getHtmlContent(folder: string, filePath: string): Promise<string> {
  let fullPath = urlPath + folder + filePath;

  while (fullPath.includes('+')) {
    fullPath = fullPath.replace(`+`, '%2B');
  }

  try {
    const response = await fetch(fullPath);
    const htmlContent = await response.text();
    return htmlContent; // Return the HTML content
  }
  // Handle the case where no text was found
  catch (error) {
    console.error('Error loading HTML content:', error);
    const textExample = `<p>Fant ikke filtekst... </p>`;
    return textExample;
  }
}

/**
 * @param {string} fileName - The name of the file.
 * @returns {string} The extracted and formatted part of the file name.
 */
function extractButtonName(fileName: string): string {

  const nameWithoutExtension = fileName.replace('.html', '');
  const decodedName = decodeURIComponent(nameWithoutExtension);
  const nameWithSpaces = decodedName.replace(/-/g, ' ');
  const words = nameWithSpaces.split(' ');

  // Capitalize the first word and wrap the last word (language code) in parentheses
  const formattedWords = words.map((word, index) => {
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    } else if (index === words.length - 1) {
      return `(${word.toUpperCase()})`;
    }
    return word;
  });

  return formattedWords.join(' ');
}

/**
 * @param folderName
 * @returns folderName with underscores replaced by spaces and slashes removed
 */
function cleanTitle(folderName: string): string {
  const parts = folderName.split('/');
  const lastPart = parts[parts.length -2];
  const decodedName = decodeURIComponent(lastPart);
  const newName = decodedName.replace(/_/g, ' ');
  return newName;
}