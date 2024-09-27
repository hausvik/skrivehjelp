import { initializeArbeidsavtalepane } from '../arbeidsavtalepane/arbeidsavtalepane';
import { initializeStandardtekstpane } from '../tilretteleggingspane/tilretteleggingspane';
import { createDynamicPane } from '../dynamicpane/dynamicpane';

import arbeidsavtalepaneHtml from '../arbeidsavtalepane/arbeidsavtalepane.html';
import tilretteleggingspaneHtml from '../tilretteleggingspane/tilretteleggingspane.html';
import dynamicpaneHtml from '../dynamicpane/dynamicpane.html';

/* global document, Office, Word */

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    const sideloadMsg = document.getElementById("sideload-msg") as HTMLElement;
    const appBody = document.getElementById("app-body") as HTMLElement;
    const arbeidsavtaleButton = document.getElementById("arbeidsavtale") as HTMLButtonElement;
    const tilretteleggingButton = document.getElementById("tilrettelegging") as HTMLButtonElement;

    if (sideloadMsg) sideloadMsg.style.display = "none";
    if (appBody) appBody.style.display = "flex";
    if (arbeidsavtaleButton) arbeidsavtaleButton.onclick = () => newPane("arbeidsavtale");
    if (tilretteleggingButton) tilretteleggingButton.onclick = () => newPane("tilrettelegging");
  }
});

/**
 * Inserts the HTML for the new pane into the document.
 * Serves as a template for later HTMLtext insertions.
 */
export async function newPane(paneName: string, htmlContent?: string) {
  const taskPaneBody = document.getElementById("app-body");

  if (taskPaneBody) {
    switch (paneName) {
      case "arbeidsavtale":
        taskPaneBody.innerHTML = arbeidsavtalepaneHtml;
        initializeArbeidsavtalepane();
        break;
      case "tilrettelegging":
        taskPaneBody.innerHTML = tilretteleggingspaneHtml;
        initializeStandardtekstpane();
        break;
      case "dynamicpane":
        taskPaneBody.innerHTML = dynamicpaneHtml;
        createDynamicPane(htmlContent || "");
      default:
        break;
    }
  }
}

/**
 * Inserts the given text into the document.
 * @param textToInsert The text to insert into the document
 * @param bookmarkName Optional parameter: The name of the bookmark where the text will be inserted
 * @param copyHeader Optional parameter: Whether to copy the first page header to the primary header
 */
export async function insertText(textToInsert: string, bookmarkName?: string, copyHeader?: boolean) {
  return Word.run(async (context) => {
    let range;

    if (bookmarkName) {
      try {
        range = context.document.getBookmarkRange(bookmarkName);
      } catch (error) {
        console.error("Bookmark not found, using document's end.", error);
      }
    }

    // If range is not set (either bookmarkName was not provided or bookmark was not found),
    // use the range at the end of the document
    if (!range) {
      const body = context.document.body;
      range = body.getRange('End');
    }

    context.load(range);
    await context.sync();

    range.insertHtml(textToInsert, Word.InsertLocation.replace);
    await context.sync();

    if (copyHeader) {
      await copyFirstPageHeaderToPrimaryHeader();
    }
  });
}

/**
 * Copies the content of the first page header to the primary header after removing <p> tags with only non-breaking spaces.
 */
async function copyFirstPageHeaderToPrimaryHeader() {
  await Word.run(async (context) => {
    const firstPageHeaderHTMLPromise = context.document.sections.getFirst().getHeader(Word.HeaderFooterType.firstPage).getRange().getHtml();
    const primaryHeaderRange = context.document.sections.getFirst().getHeader(Word.HeaderFooterType.primary).getRange();

    await context.sync();
    const firstPageHeaderHTML = firstPageHeaderHTMLPromise.value;

    await context.sync(); 
    primaryHeaderRange.insertHtml(firstPageHeaderHTML, Word.InsertLocation.start);

    await context.sync();
  }).catch(error => {
  });
}