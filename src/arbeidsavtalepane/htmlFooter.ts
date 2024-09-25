


export function getArbeidsavtaleFooter(engelsk: boolean, signName: string, signPos: string) {
    return `
<table style="border-collapse: collapse; width: 100%;">
    <tr>
        <td style="width: 45%; border-bottom: 1px solid #000; padding: 0 6px; height: 1cm; vertical-align: top;"></td>
        <td style="width: 10%; padding: 0 6px; height: 1cm; vertical-align: top;"></td>
        <td style="width: 45%; border-bottom: 1px solid #000; padding: 0 6px; height: 1cm; vertical-align: top;"></td>
    </tr>
    <tr>
        <td style="width: 45%; padding: 6px 0; text-align: center; vertical-align: top;">${engelsk ? "Date" : "Dato"}</td>
        <td style="width: 10%; vertical-align: top;"></td>
        <td style="width: 45%; padding: 6px 0; text-align: center; vertical-align: top;">${engelsk ? "Date" : "Dato"}</td>
    </tr>
    <tr>
        <td style="width: 45%; border-bottom: 1px solid #000; padding: 0 6px; height: 1cm; vertical-align: top;"></td>
        <td style="width: 10%; padding: 0 6px; height: 1cm; vertical-align: top;"></td>
        <td style="width: 45%; border-bottom: 1px solid #000; padding: 0 6px; height: 1cm; vertical-align: top;"></td>
    </tr>
    <tr>
        <td style="width: 45%; padding: 10px 0; text-align: center; vertical-align: top;">${engelsk ? "Employee's signature" : "Arbeidstakers underskrift"}</td>
        <td style="width: 10%; vertical-align: top;"></td>
        <td style="width: 45%; padding: 10px 0; text-align: center; vertical-align: top;">${signName}<br>${signPos}</td>
    </tr>
</table>
    <p style="font-family: Arial, sans-serif; font-size: 11pt; font-style: italic;">${engelsk ? "The document is electronically approved and therefore has no handwritten signatures." : "Dokumentet er elektronisk godkjent og har derfor ingen håndskrevne signaturer."}</p>
        `;
}
