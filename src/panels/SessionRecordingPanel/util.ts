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

/**
 * Parses a filename into its base name and extension, and determines whether it is a
 * duplicate
 * @param file The full filename including extension (e.g., 'foo.osrec')
 * @param fileCounts A map of base filenames (without extension) to the number of times
 * they appear
 * @returns An object containing the base filename, thefile extension (including the dot),
 * and a bolean indicating whether the base filename occurs more than once
 */
export function parseFilename(
  file: string,
  fileCounts: Map<string, number>
): { filename: string; extension: string; isFileDuplicate: boolean } {
  const extensionIndex = file.lastIndexOf('.');
  const hasExtension = extensionIndex !== -1;

  const filename = hasExtension ? file.substring(0, extensionIndex) : file;
  const extension = hasExtension ? file.substring(extensionIndex) : '';

  const count = fileCounts.get(filename) ?? 0;
  const isFileDuplicate = count > 1;

  return { filename, extension, isFileDuplicate };
}
