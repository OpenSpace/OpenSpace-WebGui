import { useCallback, useEffect, useState } from 'react';
import { ActionIcon, Group, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { wordBeginningSubString } from '@/components/FilterList/util';
import { ReplayIcon } from '@/icons/icons';

import { ScriptLogEntry } from './ScriptLogEntry';

// TODO (anden88 2025-04-17): Remove when lists from OpenSpace don't have the
// ['1']: value, ['2']: value format
type FileLines = Record<string, string> | undefined;

export function ScriptLogPanel() {
  const luaApi = useOpenSpaceApi();
  const [scriptLogEntries, setScriptLogEntries] = useState<string[]>([]);

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

  function preprocessScriptEntry(entry: string): string {
    // @TODO (anden88, 2025-04-17): do we want to rewrite this using regex instead?
    // return entry.replace(/[.,()""]/g, ' ');
    return entry
      .replaceAll('.', ' ')
      .replaceAll(',', ' ')
      .replaceAll('"', ' ')
      .replaceAll('(', ' ')
      .replaceAll(')', ' ');
  }

  return (
    <FilterList isLoading={scriptLogEntries.length === 0}>
      <Group gap={'xs'}>
        <Tooltip label={'Refresh script log'}>
          <ActionIcon onClick={fetchScriptLogEntries} aria-label={'Refresh script log'}>
            <ReplayIcon />
          </ActionIcon>
        </Tooltip>
        <FilterList.InputField placeHolderSearchText={'Search for a script'} flex={1} />
      </Group>
      <FilterList.SearchResults
        data={scriptLogEntries}
        renderElement={(entry) => <ScriptLogEntry script={entry} />}
        matcherFunc={(data, searchString) => {
          const preprocessedData = preprocessScriptEntry(data);
          return wordBeginningSubString(preprocessedData, searchString);
        }}
      >
        <FilterList.SearchResults.VirtualList gap={'xs'} />
      </FilterList.SearchResults>
    </FilterList>
  );
}
