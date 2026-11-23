import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFileDialog } from '@mantine/hooks';
import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { TFunction } from 'i18next';

import { useAppDispatch } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { NotificationLevel } from '@/types/enums';
import { FileExtension, MediaType } from '@/types/types';

function useLoadJsonFile(handlePickedFile: (content: JSON) => void): () => void {
  const { t } = useTranslation('notifications', { keyPrefix: 'error' });

  const fileDialog = useFileDialog({
    multiple: false,
    accept: '.json',
    resetOnOpen: true,
    onChange: readFile
  });

  const dispatch = useAppDispatch();

  async function readFile(contents: FileList | null) {
    try {
      const content = await contents?.[0]?.text();
      if (!content) {
        return;
      }
      const json = JSON.parse(content);
      handlePickedFile(json);
    } catch (e) {
      dispatch(handleNotificationLogging(t('parsing-file'), e, NotificationLevel.Error));
    }
  }

  function openLoadFileDialog() {
    fileDialog.open();
  }

  return openLoadFileDialog;
}

// For documentation about these features please read this article:
// https://developer.chrome.com/docs/capabilities/browser-fs-access#opening_files_2
export type SaveResult =
  // Saved through the file picker, `name` is the name chosen by the user
  | { status: 'saved'; name: string }
  // Handed to the browser as a download, `name` is the requested name
  | { status: 'downloaded'; name: string }
  // Saving failed, reported as a notification
  | { status: 'failed' }
  // The user closed the save dialog
  | { status: 'cancelled' };

async function openSaveFileDialogInternal(
  contentsString: string,
  fileName: string,
  extension: FileExtension,
  mediaType: MediaType,
  dispatch: Dispatch<UnknownAction>,
  t: TFunction<'notifications', 'error'>
): Promise<SaveResult> {
  const supportsSaveDialog = 'showSaveFilePicker' in self;
  if (supportsSaveDialog) {
    const options: SaveFilePickerOptions = {
      suggestedName: fileName,
      types: [
        {
          description: 'Text Files',
          accept: {
            [mediaType]: [extension]
          }
        }
      ]
    };
    try {
      // For some reason typescript doesn't recognize this as a function
      // It is an experimental feature of the chromium browser
      const fileHandle = await window.showSaveFilePicker(options);

      // Create a FileSystemWritableFileStream to write to
      const writable = await fileHandle.createWritable();

      // Write the contents of the file to the stream
      await writable.write(contentsString);

      // Close the file and write the contents to disk
      await writable.close();
      return { status: 'saved', name: fileHandle.name };
    } catch (e) {
      // The user closing the dialog is not an error
      if (e instanceof DOMException && e.name === 'AbortError') {
        return { status: 'cancelled' };
      }
      dispatch(handleNotificationLogging(t('parsing-file'), e, NotificationLevel.Error));
      return { status: 'failed' };
    }
  } else {
    // This is the fallback code if showSaveFilePicker is not available
    // (Firefox for example).
    // Will download the file to Downloads. Looks hacky but it seems endorsed by chromium ¯\_(ツ)_/¯
    // https://developer.chrome.com/docs/capabilities/browser-fs-access#saving_rather_downloading_files
    const blob = new Blob([contentsString], {
      type: mediaType
    });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', () => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
    return { status: 'downloaded', name: fileName };
  }
}

/**
 * @returns A function that saves text contents to a file, using a save dialog when the
 * browser supports it and a download otherwise. It resolves to a `SaveResult`.
 */
export function useSaveFile() {
  const { t } = useTranslation('notifications', { keyPrefix: 'error' });
  const dispatch = useAppDispatch();

  return (
    contents: string,
    fileName: string,
    extension: FileExtension,
    mediaType: MediaType
  ) => openSaveFileDialogInternal(contents, fileName, extension, mediaType, dispatch, t);
}

// Exporting these as a hook as they seem to belong in the same file,
// even though only on of them is a hook
export function useSaveLoadJsonFiles(handlePickedFile: (content: JSON) => void) {
  const { t } = useTranslation('notifications', { keyPrefix: 'error' });

  const openLoadFileDialog = useLoadJsonFile(handlePickedFile);
  const dispatch = useAppDispatch();

  async function openSaveFileDialog(contents: JSON) {
    openSaveFileDialogInternal(
      JSON.stringify(contents, null, 2),
      'layout.json',
      '.json',
      'application/json',
      dispatch,
      t
    );
  }

  return { openSaveFileDialog, openLoadFileDialog };
}

/**
 * Check if an image exists at a given URL.
 *
 * @param url The URL of the image to check.
 * @returns A boolean indicating whether the image exists.
 */
export function useImageExists(url: string): boolean {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.onload = () => setExists(true);
    img.onerror = () => setExists(false);
  }, [url]);

  return exists;
}
