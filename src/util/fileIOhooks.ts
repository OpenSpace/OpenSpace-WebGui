import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFileDialog } from '@mantine/hooks';
import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { TFunction } from 'i18next';

import { useAppDispatch } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { LogLevel } from '@/types/enums';

function useLoadJsonFile(handlePickedFile: (content: JSON) => void): () => void {
  const { t } = useTranslation('notifications', { keyPrefix: 'error' });
  const dispatch = useAppDispatch();

  const fileDialog = useFileDialog({
    multiple: false,
    accept: '.json',
    resetOnOpen: true,
    onChange: readFile
  });

  async function readFile(contents: FileList | null) {
    try {
      const content = await contents?.[0]?.text();
      if (!content) {
        return;
      }
      const json = JSON.parse(content);
      handlePickedFile(json);
    } catch (e) {
      dispatch(handleNotificationLogging(t('parsing-file'), e, LogLevel.Error));
    }
  }

  function openLoadFileDialog() {
    fileDialog.open();
  }

  return openLoadFileDialog;
}

// For documentation about these features please read this article:
// https://developer.chrome.com/docs/capabilities/browser-fs-access#opening_files_2
async function openSaveFileDialogInternal(
  contents: JSON,
  dispatch: Dispatch<UnknownAction>,
  t: TFunction<'notifications', 'error'>
) {
  const contentsString = JSON.stringify(contents, null, 2);

  const supportsSaveDialog = 'showSaveFilePicker' in self;
  if (supportsSaveDialog) {
    const options: SaveFilePickerOptions = {
      types: [
        {
          description: 'Text Files',
          accept: {
            'text/plain': ['.json']
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
    } catch (e) {
      dispatch(handleNotificationLogging(t('parsing-file'), e, LogLevel.Error));
    }
  } else {
    // This is the fallback code if showSaveFilePicker is not available
    // (Firefox for example).
    // Will download the file to Downloads. Looks hacky but it seems endorsed by chromium ¯\_(ツ)_/¯
    // https://developer.chrome.com/docs/capabilities/browser-fs-access#saving_rather_downloading_files
    const blob = new Blob([contentsString], {
      type: 'application/json'
    });
    const a = document.createElement('a');
    a.download = 'layout.json';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', () => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  }
}

// Exporting these as a hook as they seem to belong in the same file,
// even though only on of them is a hook
export function useSaveLoadJsonFiles(handlePickedFile: (content: JSON) => void) {
  const openLoadFileDialog = useLoadJsonFile(handlePickedFile);
  const { t } = useTranslation('notifications', { keyPrefix: 'error' });
  const dispatch = useAppDispatch();

  async function openSaveFileDialog(contents: JSON) {
    openSaveFileDialogInternal(contents, dispatch, t);
  }

  return { openSaveFileDialog, openLoadFileDialog };
}

/**
 * Check if an image exists at a given URL.
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
