


export function getArbeidsavtaleFooter(engelsk: boolean, signName: string, signPos: string) {
    return `
        <br>
    <table style="border-collapse: collapse; width: 100%;">
        <tr>
            <td style="border-bottom: 1px solid #000; padding: 0 10px; height: 2cm; vertical-align: top;"></td>
            <td style="padding: 0 10px; height: 2cm; vertical-align: top;"></td>
            <td style="border-bottom: 1px solid #000; padding: 0 10px; height: 2cm; vertical-align: top;"></td>
        </tr>
        <tr>
            <td style="padding: 10px 0; text-align: center; vertical-align: top;">${engelsk ? "Date" : "Dato"}</td>
            <td vertical-align: top;"></td>
            <td style="padding: 10px 0; text-align: center; vertical-align: top;">${engelsk ? "Date" : "Dato"}</td>
        </tr>
        <tr>
            <td style="border-bottom: 1px solid #000; padding: 0 10px; height: 2cm; vertical-align: top;"></td>
            <td style="padding: 0 10px; height: 2cm; vertical-align: top;"></td>
            <td style="border-bottom: 1px solid #000; padding: 0 10px; height: 2cm; vertical-align: top;"></td>
        </tr>
        <tr>
            <td style="padding: 20px 0; text-align: center; vertical-align: top;">${engelsk ? "Employee's signature" : "Arbeidstakers underskrift"}</td>
            <td vertical-align: top;"></td>
            <td style="padding: 20px 0; text-align: center; vertical-align: top;">${signName}<br>${signPos}</td>
        </tr>
    </table>
<br>
    <p style="font-style: italic;">${engelsk ? "The document is electronically approved and therefore has no handwritten signatures." : "Dokumentet er elektronisk godkjent og har derfor ingen håndskrevne signaturer."}</p>
        `;
}
