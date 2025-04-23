import { useCallback, useEffect, useState } from 'react';
import { ActionIcon, Group, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { wordBeginningSubString } from '@/components/FilterList/util';
import { RefreshIcon } from '@/icons/icons';

import { ScriptLogEntry } from './ScriptLogEntry';

// TODO (anden88 2025-04-17): Remove when lists from OpenSpace don't have the
// ['1']: value, ['2']: value format
type FileLines = Record<string, string> | undefined;

export function ScriptLogPanel() {
  const [scriptLogEntries, setScriptLogEntries] = useState<string[] | undefined>(
    undefined
  );
  const luaApi = useOpenSpaceApi();

  const fetchScriptLogEntries = useCallback(async () => {
    // eslint-disable-next-line no-template-curly-in-string
    const fileName = await luaApi?.absPath('${LOGS}/ScriptLog.txt');

    if (!fileName) {
      return;
    }
    const data = (await luaApi?.readFileLines(fileName)) as FileLines;

    if (!data) {
      return;
    }

    setScriptLogEntries(
      Object.values(data)
        .filter((script) => script)
        .reverse()
    );
  }, [luaApi]);

  useEffect(() => {
    fetchScriptLogEntries();
  }, [fetchScriptLogEntries]);

  function sanitizeScript(script: string): string {
    // Replace special characters with spaces. The '+' ensures repeated punctuation is
    // replaced by a single space instead of many
    return script.replace(/[.,()[\]{}"'\\/]+/g, ' ');
  }

  return (
    <FilterList isLoading={scriptLogEntries === undefined}>
      <Group gap={'xs'}>
        <Tooltip label={'Refresh script log'}>
          <ActionIcon onClick={fetchScriptLogEntries} aria-label={'Refresh script log'}>
            <RefreshIcon />
          </ActionIcon>
        </Tooltip>
        <FilterList.InputField placeHolderSearchText={'Search for a script'} flex={1} />
      </Group>
      <FilterList.SearchResults
        data={scriptLogEntries ?? []}
        renderElement={(entry) => <ScriptLogEntry script={entry} />}
        matcherFunc={(script, searchString) => {
          return wordBeginningSubString(sanitizeScript(script), searchString);
        }}
      >
        <FilterList.SearchResults.VirtualList gap={3} />
      </FilterList.SearchResults>
    </FilterList>
  );
}
