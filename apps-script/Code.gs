/**
 * Public JSONP bridge for the PDF viewer.
 * Deploy as a Web App: Execute as you, access: Anyone.
 * Anyone who can call the deployment can receive this PDF; use only for public documents.
 */
const DRIVE_FILE_ID = '1cPw_QqntEvepwkR0Bbyx1VZR6Y4qtAav';
const MAX_PDF_BYTES = 10 * 1024 * 1024; // Conservative limit: 10 MiB.
const JSONP_CALLBACK = 'pdfViewerDriveCallback';

function doGet(e) {
  try {
    // Do not reflect arbitrary callback text into executable JavaScript.
    if (!e || !e.parameter || e.parameter.callback !== JSONP_CALLBACK) {
      return jsonp_({ error: 'Invalid callback. Check the viewer configuration.' });
    }

    const file = DriveApp.getFileById(DRIVE_FILE_ID);
    const blob = file.getBlob();
    const bytes = blob.getBytes();
    if (bytes.length > MAX_PDF_BYTES) {
      return jsonp_({ error: 'PDF exceeds the configured 10 MiB Apps Script proxy limit.' });
    }
    if (blob.getContentType() !== MimeType.PDF && !/\.pdf$/i.test(file.getName())) {
      return jsonp_({ error: 'The Drive file does not appear to be a PDF.' });
    }

    return jsonp_({ data: Utilities.base64Encode(bytes) });
  } catch (error) {
    // Do not expose stack traces, Drive details, or account information to visitors.
    console.error(error);
    return jsonp_({ error: 'Could not read the PDF from Google Drive. Check file access and Apps Script authorization.' });
  }
}

function jsonp_(payload) {
  // Payload is serialized by JSON.stringify, so embedded file bytes cannot escape the JS string.
  const body = JSONP_CALLBACK + '(' + JSON.stringify(payload) + ');';
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
