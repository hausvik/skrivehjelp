// htmlContent.ts

export const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Demo Text</title>
      <style>
          h1 {
              color: blue;
              font-size: 24px;
          }
          table {
              border-collapse: collapse;
              width: 100%;
          }
          th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
          }
      </style>
  </head>
  <body>
      <h1>A header</h1>
      <p>This is a &&bookmark1&& with text before and after.</p>
      <table>
          <tr>
              <th>Header 1</th>
              <th>Header 2</th>
          </tr>
          <tr>
              <td>This is a &&bookmark2&& within a table cell.</td>
              <td>More text here.</td>
          </tr>
      </table>
      <p>Here is another &&bookmark3&& at the end of the document.</p>
  </body>
  </html>
`;