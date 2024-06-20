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
  // Get a reference to the task pane's body
  const taskPaneBody = document.getElementById("app-body");

  // Load the content of arbeidsavtalepane.html into the taskpane
  if (taskPaneBody) {
    taskPaneBody.innerHTML = arbeidsavtalepaneHtml;
    initializeArbeidsavtalepane();
  }
}
/**
 * Inserts the given text into the document.
 * @param textToInsert The text to insert into the document
 */
export async function insertText(textToInsert: string) {
  return Word.run(async (context) => {

    let range;
    try {
      // Try to get the range of the bookmark named "START"
      range = context.document.getBookmarkRange("START");
      context.load(range);
      await context.sync();

    } catch (error) {
      // If the bookmark does not exist, use the range at the end of the document
      // Should probably be removed in production code, and instead throw an error

      const body = context.document.body;
      range = body.getRange('End');
      context.load(range);
      await context.sync();
    }

// Insert the page break and the text
range.insertHtml("<br style='mso-special-character:line-break;page-break-before:always'>" + textToInsert, Word.InsertLocation.replace);

await context.sync();
  });
}
