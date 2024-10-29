import { newPane } from '../taskpane/taskpane';

interface HtmlFile {
  name: string;
  path: string;
}

const urlPath = 'https://ds.app.uib.no/standardtekster/main/_generert/';
const urlUtkast = 'https://ds.app.uib.no/standardtekster/dev/';

async function addButtons(container: HTMLElement, url: string) {

  try {
    const folders = await fetchFolders(urlPath, '/standardtekster/main/');
    // Loops main folders
    for (const folder of folders) {
      const subfolders = await fetchSubfolders(folder, '/standardtekster/main/_generert/');
      const folderDiv = createFolderDiv(folder, 'h3');

      // Loops subfolders of folders
      for (const subfolder of subfolders) {
        const subFolderDiv = createFolderDiv(subfolder, 'h4');
        await addFileButtons(subFolderDiv, subfolder);
        folderDiv.appendChild(subFolderDiv);
      }

      await addFileButtons(folderDiv, folder);
      container.appendChild(folderDiv);
    }
  } catch (error) {
    console.error('Error fetching folders:', error);
  }

}


/**
 * Initializes the standard text pane by fetching HTML files and creating buttons for each file.
 * The buttons are added to the button container and are styled with specific classes.
 */
export async function initializeStandardtekstpane() {
  const container = document.getElementById('button-container');
  const showAll = document.getElementById('show-all') as HTMLInputElement;;

  if (!container) {
    console.error('Container element not found');
    return;
  }
  addButtons(container, urlPath)

  showAll?.addEventListener("change", async () => {
    if (showAll.checked) {
      container.innerHTML = '';
      addButtons(container, urlUtkast);
    }
    else {
      container.innerHTML = '';
      addButtons(container, urlPath);
    }


  });
  // Add Tilbake button
  const backButton = createButton('Tilbake', 'btn btn-secondary btn-sm', () => newPane());
  container.appendChild(backButton);
}

/**
 * Creates a button element with the specified text, class name, and click event handler.
 * 
 * @param {string} text - The text to display on the button.
 * @param {string} className - The class name to apply to the button.
 * @param {() => void} onClick - The click event handler for the button.
 * @returns {HTMLButtonElement} The created button element.
 */
function createButton(text: string, className: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = className;
  button.onclick = onClick;
  return button;
}

function createFolderDiv(folder: string, titleTag: 'h3' | 'h4'): HTMLDivElement {
  const isTopLevel = titleTag === 'h3';

  const folderDiv = document.createElement('div');
  folderDiv.className = isTopLevel ? 'folder-container' : 'subfolder-container';

  const folderTitle = document.createElement(titleTag);
  folderTitle.textContent = cleanTitle(folder);
  folderTitle.style.cursor = 'pointer'; // Indicate that the title is clickable

  // Create a container for the folder's contents
  const contentDiv = document.createElement('div');
  contentDiv.className = 'folder-content';
  contentDiv.style.display = 'none'; // Default to hidden for all folders

  // Add the click event listener to toggle the visibility of the content and nested contents
  folderTitle.addEventListener('click', () => {
    const isHidden = contentDiv.style.display === 'none';
    if (isTopLevel) {
      // Unhide all subfolder-containers inside the folder-container
      const subfolderContainers = folderDiv.querySelectorAll('.subfolder-container');
      subfolderContainers.forEach(subfolderContainer => {
        (subfolderContainer as HTMLElement).style.display = isHidden ? 'flex' : 'none';
      });
    } else {
      // Unhide all buttons inside the subfolder-container
      const buttons = folderDiv.querySelectorAll('button');
      buttons.forEach(button => {
        (button as HTMLElement).style.display = isHidden ? 'block' : 'none';
      });
    }
    contentDiv.style.display = isHidden ? 'block' : 'none';
  });

  folderDiv.appendChild(folderTitle);
  folderDiv.appendChild(contentDiv);

  return folderDiv;
}

async function addFileButtons(container: HTMLElement, folder: string) {
  try {
    const htmlFiles = await fetchHtmlFiles(folder);
    const contentDiv = container.querySelector('.folder-content');
    if (!contentDiv) {
      console.error('Content div not found');
      return;
    }
    for (const file of htmlFiles) {
      if (file.name) {
        const fileName = file.name;
        const button = createButton(extractButtonName(fileName), 'btn btn-primary btn-sm', async () => {
          const content = await getHtmlContent(folder, fileName);
          newPane('dynamicpane', content, extractButtonName(fileName));
        });
        contentDiv.appendChild(button);
      }
    }
  } catch (error) {
    console.error('Error fetching HTML files:', error);
  }
}

/**
 * Fetches the list of folders from the specified URL.
 * 
 * @param {string} url - The URL to fetch the folders from.
 * @param {string} [root] - The root directory to ignore.
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
 * @param {string} [root] - The root directory to ignore.
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
 * Fetches the list of HTML files from the specified folder.
 * 
 * @param {string} folder - The folder to fetch HTML files from.
 * @returns {Promise<Array<HtmlFile>>} A promise that resolves to an array of HTML file objects.
 */
async function fetchHtmlFiles(folder: string): Promise<Array<HtmlFile>> {
  const fullUrl = urlPath + folder;
  const response = await fetch(fullUrl);
  const htmlText = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const fileElements = doc.querySelectorAll('a');
  const files = Array.from(fileElements).map((element) => ({
    name: element.getAttribute('href'),
    path: fullUrl + element.getAttribute('href')
  }));

  return files.filter((file) => file.name !== null && file.name.endsWith('.html')) as Array<HtmlFile>;
}

/**
 * Fetches the content of the specified HTML file.
 * 
 * @param {string} folder - The folder containing the HTML file.
 * @param {string} filePath - The path to the HTML file.
 * @returns {Promise<string>} A promise that resolves to the content of the HTML file.
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
    return `<p>Fant ikke filtekst... </p>`;
  }
}

/**
 * Extracts and formats the button name from the file name.
 * 
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
 * Cleans the folder name by replacing underscores with spaces and removing slashes.
 * 
 * @param {string} folderName - The name of the folder.
 * @returns {string} The cleaned folder name.
 */
function cleanTitle(folderName: string): string {
  const parts = folderName.split('/');
  const lastPart = parts[parts.length - 2];
  const decodedName = decodeURIComponent(lastPart);
  let newName = decodedName.replace(/_/g, ' ');
  newName = newName.replace(/-/g, ' ');
  return newName;
}
