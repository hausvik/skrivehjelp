
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

import { htmlContent } from './htmlContent';

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("testMal").onclick = testMal; // A clicker is needed for every button
  }
});

/**
 * Inserts the HTML for testMal into the document.
 * Serves as a template for later HTMLtext insertions.
 */
export async function testMal() {
  const textToInsert = htmlContent;
  run(textToInsert);
}


export async function run(textToInsert) {
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

    await insertTextAndCreateBookmarks(context, range, textToInsert);
    await context.sync();
  });
}

/**
 * Inserts the text and creates bookmarks for each instance of the pattern '{{bookmark}}'.
 * @param context The Word request context
 * @param range The range to insert the initial text at
 * @param textToInsert The HTMLtext to insert as a string
 */
async function insertTextAndCreateBookmarks(context: Word.RequestContext, range: Word.Range, textToInsert: string): Promise<void> {
  // Insert the text
  range.insertHtml(textToInsert, Word.InsertLocation.replace);
  range.insertBookmark("START");

  // Search for the pattern '{{bookmark}}'
  const searchResults = context.document.body.search('{{*}}', { matchWildcards: true });

  // Load the search results into memory
  context.load(searchResults, 'text, font');
  await context.sync();

  // Replace each match with a bookmark
  for (let i = 0; i < searchResults.items.length; i++) {
    const bookmarkName = searchResults.items[i].text.slice(2, -2); // Remove the '&&' symbols from the bookmark name
    searchResults.items[i].insertBookmark(bookmarkName);
    let bookmarkRange = context.document.getBookmarkRange(bookmarkName);
    bookmarkRange.insertText(bookmarkName, Word.InsertLocation.replace);
    bookmarkRange.insertBookmark(bookmarkName);
  }
}

