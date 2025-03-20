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

export async function saveFileFromPicker(contents: string) {
  // TODO handle this better? What do we want to happen in
  // unsupported browsers?
  if (!('showSaveFilePicker' in self)) {
    throw new Error('File picker not supported in this browser');
  }
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
  const fileHandle = await window.showSaveFilePicker(options);

  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();

  // Write the contents of the file to the stream.
  await writable.write(contents);

  // Close the file and write the contents to disk.
  await writable.close();
}
