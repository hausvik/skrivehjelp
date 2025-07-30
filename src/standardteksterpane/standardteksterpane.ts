import { newPane } from '../taskpane/taskpane';

interface HtmlFile {
  name: string;
  path: string;
}

interface MetadataFile {
  filename: string;
  filepath: string;
  title: string;
  ansvarligEnhet: string;
  kontaktperson: string;
  FUP: string;
  draft: boolean;
  lang: string;
  translations?: string[];
}

interface MetadataResponse {
  files: MetadataFile[];
}

const metadataUrl = 'https://ds.app.uib.no/standardtekster/main/metadata.json';
const urlPathMain = 'https://ds.app.uib.no/standardtekster/main/_generert/';

async function addButtons(container: HTMLElement) {
  try {
    const metadata = await fetchMetadata();
    const folderStructure = await createFolderStructureFromMetadata(metadata, false);
    
    // Get the keys in sorted order and append the folders in that order
    const sortedKeys = Object.keys(folderStructure).sort((a, b) => {
      const aLastPart = a.split('/').pop() || '';
      const bLastPart = b.split('/').pop() || '';
      
      const aFirstLetter = aLastPart.charAt(0).toUpperCase();
      const bFirstLetter = bLastPart.charAt(0).toUpperCase();
      
      if (aFirstLetter !== bFirstLetter) {
        return aFirstLetter.localeCompare(bFirstLetter);
      }
      
      return a.localeCompare(b);
    });
    
    for (const key of sortedKeys) {
      container.appendChild(folderStructure[key]);
    }
  } catch (error) {
    console.error('Error fetching metadata:', error);
    container.innerHTML = `<p>Kunne ikke laste inn metadata. Vennligst prøv igjen senare.</p>`;
  }
}

/**
 * Fetches the metadata from the server.
 * 
 * @returns {Promise<MetadataResponse>} A promise that resolves to the metadata response.
 */
async function fetchMetadata(): Promise<MetadataResponse> {
  const response = await fetch(metadataUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Creates folder structure from metadata with proper nesting.
 * 
 * @param {MetadataResponse} metadata - The metadata response.
 * @param {boolean} includeDrafts - Whether to include draft files.
 * @returns {Promise<Record<string, HTMLDivElement>>} A promise that resolves to folder structure.
 */
async function createFolderStructureFromMetadata(metadata: MetadataResponse, includeDrafts: boolean): Promise<Record<string, HTMLDivElement>> {
  const folderStructure: Record<string, HTMLDivElement> = {};
  const folderFiles: Record<string, MetadataFile[]> = {};
  const allFolderPaths = new Set<string>();

  // Filter files based on draft status first
  const filesToProcess = includeDrafts ? metadata.files : metadata.files.filter(file => !file.draft);

  // Collect all folder paths and group files
  for (const file of filesToProcess) {
    let pathParts = file.filepath.split('/').slice(0, -1); // Remove filename
    
    // Skip "_kildefiler" layer if it exists
    if (pathParts[0] === '_kildefiler') {
      pathParts = pathParts.slice(1);
    }
    
    // Add all nested folder paths
    for (let i = 1; i <= pathParts.length; i++) {
      const folderPath = pathParts.slice(0, i).join('/');
      allFolderPaths.add(folderPath);
    }
    
    // Group files by their immediate parent folder
    const immediateFolder = pathParts.join('/');
    if (!folderFiles[immediateFolder]) {
      folderFiles[immediateFolder] = [];
    }
    folderFiles[immediateFolder].push(file);
  }

  // Create folder divs for all paths
  const sortedPaths = Array.from(allFolderPaths).sort((a, b) => {
    // Custom sorting to handle folder names like A_, A.c_, C_
    const aLastPart = a.split('/').pop() || '';
    const bLastPart = b.split('/').pop() || '';
    
    // Extract the first letter for primary sorting
    const aFirstLetter = aLastPart.charAt(0).toUpperCase();
    const bFirstLetter = bLastPart.charAt(0).toUpperCase();
    
    if (aFirstLetter !== bFirstLetter) {
      return aFirstLetter.localeCompare(bFirstLetter);
    }
    
    // If first letters are the same, sort by the full path
    return a.localeCompare(b);
  });
  
  for (const folderPath of sortedPaths) {
    const pathParts = folderPath.split('/');
    const folderName = pathParts[pathParts.length - 1];
    const depth = pathParts.length;
    
    // Determine if this is a top-level folder or subfolder
    const isTopLevel = depth === 1;
    const folderDiv = createFolderDiv(folderName, isTopLevel ? 'h3' : 'h4');
    
    // Add files to this folder if any exist
    const files = folderFiles[folderPath];
    if (files && files.length > 0) {
      await addFileButtonsFromMetadata(folderDiv, files, includeDrafts);
    }
    
    folderStructure[folderPath] = folderDiv;
  }

  // Create parent-child relationships
  for (const folderPath of sortedPaths) {
    const pathParts = folderPath.split('/');
    if (pathParts.length > 1) {
      const parentPath = pathParts.slice(0, -1).join('/');
      const parentDiv = folderStructure[parentPath];
      const childDiv = folderStructure[folderPath];
      
      if (parentDiv && childDiv) {
        const parentContentDiv = parentDiv.querySelector('.folder-content');
        if (parentContentDiv) {
          // Hide subfolders by default
          childDiv.style.display = 'none';
          parentContentDiv.appendChild(childDiv);
        }
      }
    }
  }

  // Return only top-level folders, maintaining sorted order
  const topLevelFolders: Record<string, HTMLDivElement> = {};
  const topLevelPaths = sortedPaths.filter(folderPath => 
    !folderPath.includes('/') || folderPath.split('/').length === 1
  );
  
  for (const folderPath of topLevelPaths) {
    const folderDiv = folderStructure[folderPath];
    if (folderDiv) {
      topLevelFolders[folderPath] = folderDiv;
    }
  }

  return topLevelFolders;
}

/**
 * Creates file buttons from metadata.
 * 
 * @param {HTMLElement} container - The container element.
 * @param {MetadataFile[]} files - Array of metadata files.
 * @param {boolean} includeDrafts - Whether to include draft files.
 */
async function addFileButtonsFromMetadata(container: HTMLElement, files: MetadataFile[], includeDrafts: boolean) {
  const contentDiv = container.querySelector('.folder-content');
  if (!contentDiv) {
    console.error('Content div not found');
    return;
  }

  const productionFiles = files.filter(file => !file.draft);
  const draftFiles = files.filter(file => file.draft);

  // Create buttons for production files
  for (const file of productionFiles) {
    const buttonClass = 'btn-production';
    const button = createButton(file.title, buttonClass, async () => {
      const htmlFileName = file.filename.replace('.md', '.html');
      // Remove filename and _kildefiler from path for URL construction
      let pathParts = file.filepath.split('/').slice(0, -1); // Remove filename
      if (pathParts[0] === '_kildefiler') {
        pathParts = pathParts.slice(1); // Remove _kildefiler
      }
      const folderPath = pathParts.join('/') + '/';
      const content = await getHtmlContent(folderPath, htmlFileName, urlPathMain);
      newPane('dynamicpane', content, file.title);
    });

    contentDiv.appendChild(button);
  }

  // Create buttons for draft files if included
  if (includeDrafts) {
    for (const file of draftFiles) {
      const buttonClass = 'btn-draft';
      const button = createButton(file.title, buttonClass, async () => {
        const htmlFileName = file.filename.replace('.md', '.html');
        // Remove filename and _kildefiler from path for URL construction
        let pathParts = file.filepath.split('/').slice(0, -1); // Remove filename
        if (pathParts[0] === '_kildefiler') {
          pathParts = pathParts.slice(1); // Remove _kildefiler
        }
        const folderPath = pathParts.join('/') + '/';
        const content = await getHtmlContent(folderPath, htmlFileName, urlPathMain);
        newPane('dynamicpane', content, file.title);
      });

      contentDiv.appendChild(button);
    }
  }
}

/**
 * Initializes the standard text pane by fetching metadata and creating buttons for each file.
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
      const container = document.getElementById('button-container');

      if (checkbox.checked) {
        // Clear the container to avoid duplicates
        if (container) {
          container.innerHTML = '';
        }

        // Show draft buttons
        try {
          const metadata = await fetchMetadata();
          const folderStructure = await createFolderStructureFromMetadata(metadata, true);
          
          // Get the keys in sorted order and append the folders in that order
          const sortedKeys = Object.keys(folderStructure).sort((a, b) => {
            const aLastPart = a.split('/').pop() || '';
            const bLastPart = b.split('/').pop() || '';
            
            const aFirstLetter = aLastPart.charAt(0).toUpperCase();
            const bFirstLetter = bLastPart.charAt(0).toUpperCase();
            
            if (aFirstLetter !== bFirstLetter) {
              return aFirstLetter.localeCompare(bFirstLetter);
            }
            
            return a.localeCompare(b);
          });
          
          for (const key of sortedKeys) {
            if (container) {
              container.appendChild(folderStructure[key]);
            }
          }
        } catch (error) {
          console.error('Error loading with drafts:', error);
        }
      } else {
        // Clear the container to remove drafts
        if (container) {
          container.innerHTML = '';
          addButtons(container);
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
  button.addEventListener('click', onClick);
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

    // Toggle visibility of the content div
    contentDiv.style.display = isHidden ? 'block' : 'none';
    folderTitle.classList.toggle('open', isHidden);

    // Show/hide direct children (both buttons and subfolders)
    const children = Array.from(contentDiv.children);
    children.forEach((child) => {
      if (child.classList.contains('folder-container') || child.classList.contains('subfolder-container')) {
        // For subfolders, show the container but keep their content collapsed
        (child as HTMLElement).style.display = isHidden ? 'block' : 'none';
        if (!isHidden) {
          // When hiding parent, also hide subfolder contents
          const subContent = child.querySelector('.folder-content') as HTMLElement;
          if (subContent) {
            subContent.style.display = 'none';
            const subTitle = child.querySelector('.folder-title');
            if (subTitle) {
              subTitle.classList.remove('open');
            }
          }
        }
      } else {
        // For buttons, just toggle visibility
        (child as HTMLElement).style.display = isHidden ? 'block' : 'none';
      }
    });
  });

  folderDiv.append(folderTitle, contentDiv);
  return folderDiv;
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
 * Cleans the folder name by replacing underscores with spaces and removing slashes.
 * 
 * @param {string} folderName - The name of the folder.
 * @returns {string} The cleaned folder name.
 */
function cleanTitle(folderName: string): string {
  const lastPart = decodeURIComponent(folderName.split('/').pop() || folderName);
  return lastPart.replace(/[_-]/g, ' ');
}