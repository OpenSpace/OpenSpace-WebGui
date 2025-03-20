import { useFileDialog } from '@mantine/hooks';

export function useLoadJsonFile(onFileOpened: (content: JSON) => void): {
  openLoadFileDialog: () => void;
} {
  const fileDialog = useFileDialog({
    multiple: false,
    accept: '.json',
    resetOnOpen: true,
    onChange: readOpenedLayout
  });

  async function readOpenedLayout(contents: FileList | null) {
    try {
      const content = await contents?.[0]?.text();
      if (!content) {
        return;
      }
      const json = JSON.parse(content);
      onFileOpened(json);
    } catch (e) {
      // TODO: do we want to throw here?
      console.error('Error parsing file', e);
    }
  }

  function openLoadFileDialog() {
    fileDialog.open();
  }

  return { openLoadFileDialog };
}

export async function saveJsonFile(contents: JSON) {
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
    // For some reason typescript doesn't recognize this as a function
    // It is an experimental feature of the chromium browser
    const fileHandle = await window.showSaveFilePicker(options);

    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();

    // Write the contents of the file to the stream.
    await writable.write(contentsString);

    // Close the file and write the contents to disk.
    await writable.close();
  } else {
    // This is the fallback code if showSaveFilePicker is not available
    // (Firefox for example).
    // Will download the file to Downloads. Kinda hacky but it works ¯\_(ツ)_/¯
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
