import { SessionRecordingExtension, SessionRecordingFormat } from './types';

/**
 * Returns the appropriate file extension for a given session recording format
 *
 * @param fileformat The session recording format
 * @returns The corresponding file extension for the given format, including the leading dot
 */
export function sessionRecordingExtension(
  fileformat: SessionRecordingFormat
): SessionRecordingExtension {
  switch (fileformat) {
    case 'Ascii':
      return '.osrectxt';
    case 'Binary':
      return '.osrec';
    default:
      throw new Error(`Unhandled session recording format: '${fileformat}'`);
  }
}

/**
 * Appends the correct file extension to a session recording filename if it is missing
 *
 * @param filename The name of the file (with or without an extension)
 * @param format The desired session recording format used to determine the appropriate
 * file extension
 * @returns The lowercase filename with the correct extension appended if it was not
 * already present.
 */
export function sessionRecordingFilenameWithExtension(
  filename: string,
  format: SessionRecordingFormat
): string {
  const extension = sessionRecordingExtension(format);

  let lowerCaseFilename = filename.toLowerCase();

  // Add the expected extension if it does not exist
  if (!lowerCaseFilename.endsWith(extension)) {
    lowerCaseFilename = lowerCaseFilename.concat(extension);
  }

  return lowerCaseFilename;
}
