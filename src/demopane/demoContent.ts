export function getDemoContent(bookmark1: string, bookmark2: string, excludeBookmark3: boolean): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Demo Text</title>
      </head>
      <body>
          <h1>A header</h1>
          <p>This is a ${bookmark1} with text before and after.</p>
          <table>
              <tr>
                  <th>Header 1</th>
                  <th>Header 2</th>
              </tr>
              <tr>
                  <td>This is a ${bookmark2} within a table cell.</td>
                  <td>More text here.</td>
              </tr>
          </table>
          ${!excludeBookmark3 ? `<p>Here is a sentence that is only available for temporary positions.</p>` : ''}
      </body>
      </html>
    `;
  }