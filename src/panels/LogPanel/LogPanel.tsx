import { useOpenSpaceApi } from '@/api/hooks';
import { Button, Container } from '@mantine/core';
import { useState } from 'react';

export function LogPanel() {
  const luaApi = useOpenSpaceApi();
  const [scriptLogEntries, setScriptLogEntries] = useState<string[]>([]);

  async function fetchScriptLogEntries() {
    const fileName = await luaApi?.absPath('${LOGS}/ScriptLog.txt');

    if (!fileName) {
      return;
    }
    const data = await luaApi?.readFileLines(fileName);

    if (!data) {
      return;
    }

    // data is an object cause we cant frigging handle arrays correctly so the entries are
    // [1]: some string
    // [2]: some other string
    console.log(data['1']);
  }

  console.log(scriptLogEntries);

  return (
    <Container>
      <Button onClick={fetchScriptLogEntries}>Refresh</Button>
      {scriptLogEntries.map((entry) => (
        <div>{entry}</div>
      ))}
    </Container>
  );
}
