import { useFileDialog } from '@mantine/hooks';

function useLoadJsonFile(handlePickedFile: (content: JSON) => void): () => void {
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
      // TODO: do we want to throw here?
      console.error('Error parsing file', e);
    }
  }

  function openLoadFileDialog() {
    fileDialog.open();
  }

  return openLoadFileDialog;
}

// For documentation about these features please read this article:
// https://developer.chrome.com/docs/capabilities/browser-fs-access#opening_files_2
async function openSaveFileDialog(contents: JSON) {
  const contentsString = JSON.stringify(contents, null, 2);

  const supportsSaveDialog = 'showSaveFilePicker' in self;
  if (supportsSaveDialog) {
    const options = {
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
      // @TODO ylvse 2025-03-31: handle this error with the notification system?
      console.error(e);
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

  return { openSaveFileDialog, openLoadFileDialog };
}
