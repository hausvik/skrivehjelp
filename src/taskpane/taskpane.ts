import { initializeArbeidsavtalepane } from '../arbeidsavtalepane/arbeidsavtalepane';
import arbeidsavtalepaneHtml from '../arbeidsavtalepane/arbeidsavtalepane.html';
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    (document.getElementById("sideload-msg") as HTMLElement).style.display = "none";
    (document.getElementById("app-body") as HTMLElement).style.display = "flex";
    (document.getElementById("testMal") as HTMLButtonElement).onclick = arbeidsavtalePane; // A clicker is needed for every button
  }
});

/**
 * Inserts the HTML for testMal into the document.
 * Serves as a template for later HTMLtext insertions.
 */
export async function arbeidsavtalePane() {
  const taskPaneBody = document.getElementById("app-body");

  if (taskPaneBody) {
    taskPaneBody.innerHTML = arbeidsavtalepaneHtml;
    initializeArbeidsavtalepane();
  }
}
/**
 * Inserts the given text into the document.
 * @param textToInsert The text to insert into the document
 * @param bookmarkName Optional parameter: The name of the bookmark where the text will be inserted
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
  console.log("Kopi av header metode kjøres");
  await Word.run(async (context) => {
    const firstPageHeaderHTMLPromise = context.document.sections.getFirst().getHeader(Word.HeaderFooterType.firstPage).getRange().getHtml();
    const primaryHeaderRange = context.document.sections.getFirst().getHeader(Word.HeaderFooterType.primary).getRange();
    const primaryHeaderHTMLPromise = primaryHeaderRange.getHtml();

    await context.sync();

    const firstPageHeaderHTML = firstPageHeaderHTMLPromise.value;
    let primaryHeaderHTML = primaryHeaderHTMLPromise.value;

    primaryHeaderHTML = primaryHeaderHTML.replace(/<p[^>]*>\s*((<span[^>]*>\s*(&nbsp;|\s)*\s*<\/span>)\s*)+<\/p>/g, '');

    // Update the header
    primaryHeaderRange.clear();
    primaryHeaderRange.insertHtml(primaryHeaderHTML, Word.InsertLocation.replace);
    primaryHeaderRange.insertHtml(firstPageHeaderHTML, Word.InsertLocation.end);

    await context.sync();
  });
}


