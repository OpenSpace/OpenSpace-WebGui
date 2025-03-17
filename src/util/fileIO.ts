export async function loadFileFromPicker(): Promise<string> {
  if (!('showOpenFilePicker' in self)) {
    throw new Error('File picker not supported in this browser');
  }
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  return contents as string;
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
