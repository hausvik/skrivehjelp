import QRCode from 'qrcode';

/**
 * Generates a QR code image from a given URL.
 * @param url - The URL to encode in the QR code.
 * @returns A promise that resolves to a data URL of the QR code image.
 */
export async function generateQRCode(url: string): Promise<string> {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(url);
        return qrCodeDataUrl;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to generate QR code: ${error.message}`);
        } else {
            throw new Error('Failed to generate QR code due to an unknown error');
        }
    }
}