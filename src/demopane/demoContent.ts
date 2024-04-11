
/**
 * Returns a simple HTML template with placeholders for bookmarks.
 * @param bookmark1 The text to insert at the first bookmark.
 * @param bookmark2 The text to insert at the second bookmark.
 * @param excludeBookmark3 Whether to exclude the third bookmark.
 * @returns Valid HTML string.
 */
export function getDemoContent(bookmark1: string, bookmark2: string, excludeBookmark3: boolean) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Tekst mal for demo</title>
      </head>
      <body>
          <h1>En tittel</h1>
          <p>Valgt avdeling ${bookmark1} med noe tekst etter avdelingsnavnet.</p>
          <table>
              <tr>
                  <th>Header 1</th>
                  <th>Header 2</th>
              </tr>
              <tr>
                  <td>Lønnen er skrevet inn i tabellen her: ${bookmark2}</td>
                  <td>Her er det også noe tekst</td>
              </tr>
          </table>
          ${!excludeBookmark3 ? `<p>Denne teksten er ikke med i faste stillinger</p>` : ''}
      </body>
      </html>
    `;
  }