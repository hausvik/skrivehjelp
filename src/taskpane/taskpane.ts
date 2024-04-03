
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
    document.getElementById("run").onclick = run;
  }
});

export async function run() {
  return Word.run(async (context) => {
    const textToInsert = htmlContent;
    let range;
    try {
      // Try to get the range of the bookmark named "START"
      range = context.document.getBookmarkRange("START");
      context.load(range);
      await context.sync();
    } catch (error) {
      // If the bookmark does not exist, get the range at the end of the document
      const body = context.document.body;
      range = body.getRange('End');
      context.load(range);
      await context.sync();
    }

    // Insert text and create bookmarks
    await insertTextAndCreateBookmarks(context, range, textToInsert);

    await context.sync();
  });
}

async function insertTextAndCreateBookmarks(context: Word.RequestContext, range: Word.Range, textToInsert: string): Promise<void> {
  // Insert the text
  range.insertHtml(textToInsert, Word.InsertLocation.replace);

  // Search for the pattern '&&bookmark&&'
  const searchResults = context.document.body.search('&&*&&', { matchWildcards: true });

  // Load the search results into memory
  context.load(searchResults, 'text, font');
  await context.sync();

  // Replace each match with a bookmark
  for (let i = 0; i < searchResults.items.length; i++) {
    const bookmarkName = searchResults.items[i].text.slice(2, -2); // Remove the '&&' symbols from the bookmark name
    searchResults.items[i].insertBookmark(bookmarkName);
  }
}