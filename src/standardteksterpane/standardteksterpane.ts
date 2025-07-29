import { newPane } from '../taskpane/taskpane';

interface HtmlFile {
  name: string;
  path: string;
}
const urlPathMain = 'https://ds.app.uib.no/standardtekster/main/_generert/';

async function addButtons(container: HTMLElement) {
  const urlPath = urlPathMain;

  try {
    const folders = await fetchFolders(urlPath, '/standardtekster/main/');
    for (const folder of folders) {
      const folderDiv = await createFolderStructure(folder, urlPath);
      container.appendChild(folderDiv);
    }
  } catch (error) {
    console.error('Error fetching folders:', error);
    container.innerHTML = `<p>Kunne ikke laste inn mapper. Vennligst prøv igjen senere.</p>`;
  }
}

async function createFolderStructure(folder: string, urlPath: string, includeDrafts = false): Promise<HTMLDivElement> {
  const folderDiv = createFolderDiv(folder, 'h3');
  const subfolders = await fetchSubfolders(folder, '', urlPath);

  // Filter out folders that only contain draft files
  const validSubfolders = [];
  for (const subfolder of subfolders) {
    const subfolderFiles = await fetchHtmlFiles(subfolder, urlPath);
    const hasProductionFiles = subfolderFiles.some((file) => !file.name?.startsWith('UTKAST_'));

    if (hasProductionFiles || includeDrafts) {
      validSubfolders.push(subfolder);
    }
  }

  for (const subfolder of validSubfolders) {
    const subFolderDiv = await createFolderStructure(subfolder, urlPath, includeDrafts);
    subFolderDiv.style.display = 'none'; // Ensure subfolders are collapsed by default

    const contentDiv = folderDiv.querySelector('.folder-content');
    if (contentDiv) {
      contentDiv.appendChild(subFolderDiv);
    } else {
      console.error(`Content div not found for folder: ${folder}`);
    }
  }

  await addFileButtons(folderDiv, folder, urlPath, includeDrafts);
  return folderDiv;
}

/**
 * Initializes the standard text pane by fetching HTML files and creating buttons for each file.
 * The buttons are added to the button container and are styled with specific classes.
 */
export async function initializeStandardtekstpane() {
  const container = document.getElementById('button-container');
  const backButtonContainer = document.getElementById('back-button-container');

  if (!container || !backButtonContainer) {
    console.error('Container element not found');
    return;
  }
  addButtons(container);

  // Add Tilbake button
  const backButton = createButton('Tilbake', 'btn btn-secondary btn-sm', () => newPane());
  backButtonContainer.appendChild(backButton);

  // Add event listener for checkbox to show/hide draft buttons
  const checkbox = document.getElementById('show-drafts-checkbox') as HTMLInputElement;
  if (checkbox) {
    checkbox.addEventListener('change', async () => {
      const draftButtons = document.querySelectorAll('.btn-red');
      const container = document.getElementById('button-container');

      if (checkbox.checked) {
        // Clear the container to avoid duplicates
        if (container) {
          container.innerHTML = '';
        }

        // Show draft buttons and add previously skipped folders with drafts
        const folders = await fetchFolders(urlPathMain, '/standardtekster/main/');
        for (const folder of folders) {
          const folderDiv = await createFolderStructure(folder, urlPathMain, true); // Pass a flag to include drafts
          if (container && folderDiv) {
            container.appendChild(folderDiv);
          }
        }
      } else {
        // Clear the container to remove drafts
        if (container) {
          container.innerHTML = '';
        }

        // Re-add only production folders and buttons
        const folders = await fetchFolders(urlPathMain, '/standardtekster/main/');
        for (const folder of folders) {
          const folderDiv = await createFolderStructure(folder, urlPathMain, false); // Exclude drafts
          if (container && folderDiv) {
            container.appendChild(folderDiv);
          }
        }
      }
    });
  }
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
  const folderDiv = document.createElement('div');
  folderDiv.className = titleTag === 'h3' ? 'folder-container' : 'subfolder-container';

  const folderTitle = document.createElement(titleTag);
  folderTitle.textContent = cleanTitle(folder);
  folderTitle.className = 'folder-title';
  folderTitle.style.cursor = 'pointer';

  const contentDiv = document.createElement('div');
  contentDiv.className = 'folder-content';
  contentDiv.style.display = 'none';

  folderTitle.addEventListener('click', () => {
    const isHidden = contentDiv.style.display === 'none';

    // Toggle visibility of all items inside the folder
    contentDiv.style.display = isHidden ? 'block' : 'none';
    folderTitle.classList.toggle('open', isHidden);

    const children = Array.from(contentDiv.children);
    children.forEach((child) => {
      (child as HTMLElement).style.display = isHidden ? 'block' : 'none';
    });
  });

  folderDiv.append(folderTitle, contentDiv);
  return folderDiv;
}

async function addFileButtons(container: HTMLElement, folder: string, urlPath: string, includeDrafts = false) {
  try {
    const htmlFiles = await fetchHtmlFiles(folder, urlPath);
    const contentDiv = container.querySelector('.folder-content');
    if (!contentDiv) {
      console.error('Content div not found');
      return;
    }

    const productionFiles: HtmlFile[] = [];
    const draftFiles: HtmlFile[] = [];

    // Group files into production and drafts
    for (const file of htmlFiles) {
      if (file.name?.startsWith('UTKAST_')) {
        draftFiles.push(file);
      } else {
        productionFiles.push(file);
      }
    }

    // Create buttons for production files only
    for (const file of productionFiles) {
      const fileName = file.name;
      const buttonClass = 'btn-production'; // Use updated CSS class for production buttons
      const button = createButton(extractButtonName(fileName), buttonClass, async () => {
        const content = await getHtmlContent(folder, fileName, urlPath);
        newPane('dynamicpane', content, extractButtonName(fileName));
      });

      contentDiv.appendChild(button);
    }

    // Create buttons for draft files if included
    if (includeDrafts) {
      for (const file of draftFiles) {
        const fileName = file.name;
        const buttonClass = 'btn-draft'; // Use updated CSS class for draft buttons
        const button = createButton(extractButtonName(fileName), buttonClass, async () => {
          const content = await getHtmlContent(folder, fileName, urlPath);
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
 * @param {string} root - The root directory to ignore.
 * @param {string} urlPath - The base URL path.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of subfolder names.
 */
async function fetchSubfolders(folder: string, root: string, urlPath: string): Promise<Array<string>> {
  const fullUrl = urlPath + folder;
  const response = await fetch(fullUrl);
  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, 'text/html');
  const subfolders = Array.from(doc.querySelectorAll('a'))
    .map((el) => el.getAttribute('href'))
    .filter((subfolder): subfolder is string => subfolder !== null && subfolder.endsWith('/') && !subfolder.includes('_generert/'));

  return subfolders.map((subfolder) =>
    subfolder.startsWith('/') ? subfolder.slice(1) : `${folder.replace(/\/$/, '')}/${subfolder}`
  );
}

/**
 * Fetches the list of HTML files from the specified folder.
 * 
 * @param {string} folder - The folder to fetch HTML files from.
 * @param {string} urlPath - The base URL path.
 * @returns {Promise<Array<HtmlFile>>} A promise that resolves to an array of HTML file objects.
 */
async function fetchHtmlFiles(folder: string, urlPath: string): Promise<Array<HtmlFile>> {
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
 * @param {string} urlPath - The base URL path.
 * @returns {Promise<string>} A promise that resolves to the content of the HTML file.
 */
export async function getHtmlContent(folder: string, filePath: string, urlPath: string): Promise<string> {
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
  const nameWithoutExtension = decodeURIComponent(fileName.replace('.html', ''));
  let cleanedName = nameWithoutExtension;

  // Remove 'UTKAST_' prefix if it exists
  if (cleanedName.startsWith('UTKAST_')) {
    cleanedName = cleanedName.replace('UTKAST_', '');
  }

  const words = cleanedName.replace(/-/g, ' ').split(' ');

  return words
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : index === words.length - 1 ? `(${word.toUpperCase()})` : word
    )
    .join(' ');
}

/**
 * Cleans the folder name by replacing underscores with spaces and removing slashes.
 * 
 * @param {string} folderName - The name of the folder.
 * @returns {string} The cleaned folder name.
 */
function cleanTitle(folderName: string): string {
  const lastPart = decodeURIComponent(folderName.split('/').slice(-2, -1)[0]);
  return lastPart.replace(/[_-]/g, ' ');
}