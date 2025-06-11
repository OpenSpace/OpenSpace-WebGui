import { useCallback, useEffect, useState } from 'react';
import { ActionIcon, Button, Group, Text, Tooltip } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { FilterList } from '@/components/FilterList/FilterList';
import { wordBeginningSubString } from '@/components/FilterList/util';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { Layout } from '@/components/Layout/Layout';
import { CancelIcon, RefreshIcon, RerunScriptIcon } from '@/icons/icons';

import { ScriptLogEntry } from './ScriptLogEntry';

// TODO (anden88 2025-04-17): Remove when lists from OpenSpace don't have the
// ['1']: value, ['2']: value format
type FileLines = Record<string, string> | undefined;

export function ScriptLogPanel() {
  const [scriptLogEntries, setScriptLogEntries] = useState<string[] | undefined>(
    undefined
  );
  const [selectedScripts, setSelectedScripts] = useState<Set<number>>(new Set());

  const luaApi = useOpenSpaceApi();

  const fetchScriptLogEntries = useCallback(async () => {
    // eslint-disable-next-line no-template-curly-in-string
    const filename = await luaApi?.absPath('${LOGS}/ScriptLog.txt');

    if (!filename) {
      return;
    }

    const data = (await luaApi?.readFileLines(filename)) as FileLines;

    if (!data) {
      return;
    }

    setScriptLogEntries(
      Object.values(data)
        .filter((script) => {
          if (!script.trim()) {
            return false;
          }
          // Cleaning up entries caused by this panel
          if (script.includes('ScriptLog.txt')) {
            return false;
          }
          // Also filter away the script used for rerunning scripts. Assuming few people
          // use this schedule script function, this should be fine
          return !script.includes('openspace.scheduleScript');
        })
        .reverse()
        .map((script) => {
          if (script.startsWith('return openspace.')) {
            return script.substring('return '.length);
          }
          return script;
        })
    );

    setSelectedScripts(new Set());
  }, [luaApi]);

  useEffect(() => {
    fetchScriptLogEntries();
  }, [fetchScriptLogEntries]);

  function sanitizeScript(script: string): string {
    // Replace special characters with spaces. The '+' ensures repeated punctuation is
    // replaced by a single space instead of many
    return script.replace(/[.,()[\]{}"'\\/;]+/g, ' ');
  }

  function handleToggleSelection(index: number) {
    setSelectedScripts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }

  function runSelectedScripts() {
    if (scriptLogEntries === undefined || !luaApi) {
      return;
    }
    const scriptsToRun = Array.from(selectedScripts)
      .sort((a, b) => b - a)
      .map((index) => scriptLogEntries[index]);

    scriptsToRun.map((script) => luaApi.scheduleScript(script, 0));

    setSelectedScripts(new Set());
    fetchScriptLogEntries();
  }

  return (
    <Layout>
      <Layout.FixedSection mb={'xs'}>
        <Group wrap={'nowrap'} justify={'space-between'} align={'start'} gap={'xs'}>
          <Group gap={'xs'}>
            <Tooltip
              label={'Run all the selected scripts in sequential order, bottom to top'}
            >
              <Button
                onClick={runSelectedScripts}
                rightSection={<RerunScriptIcon />}
                disabled={selectedScripts.size === 0}
                variant={'filled'}
                color={'green'}
              >
                Run
              </Button>
            </Tooltip>
            <CopyToClipboardButton
              value={
                scriptLogEntries
                  ? Array.from(selectedScripts)
                      .map((index) => scriptLogEntries[index])
                      .reverse()
                      .join('\n')
                  : 'No script selected'
              }
              showLabel
              disabled={selectedScripts.size === 0}
            />
            <Tooltip label={'Clears all selected scripts'}>
              <Button
                onClick={() => setSelectedScripts(new Set())}
                rightSection={<CancelIcon />}
                disabled={selectedScripts.size === 0}
                variant={'light'}
                color={'gray'}
              >
                Clear
              </Button>
            </Tooltip>
          </Group>
          <InfoBox>
            <Text mb={'xs'}>
              This script log has been cleaned for ease of use. Some entries may have been
              filtered out unintentionally.
            </Text>
            <Text mb={'xs'}>
              Entries are listed from latest to oldest (top to bottom). Running multiple
              scripts at once will run them in the order bottom to top.
            </Text>
            <Text>
              To view the complete log or previous runs, check the{' '}
              <Text fs={'italic'} span>
                OpenSpace/logs
              </Text>{' '}
              folder.
            </Text>
          </InfoBox>
        </Group>
      </Layout.FixedSection>
      <Layout.GrowingSection>
        <FilterList isLoading={scriptLogEntries === undefined}>
          <Group gap={'xs'}>
            <Tooltip label={'Refresh script log'}>
              <ActionIcon
                onClick={fetchScriptLogEntries}
                aria-label={'Refresh script log'}
              >
                <RefreshIcon />
              </ActionIcon>
            </Tooltip>
            <FilterList.InputField
              placeHolderSearchText={'Search for a script'}
              flex={1}
            />
          </Group>
          <FilterList.SearchResults
            data={scriptLogEntries ?? []}
            renderElement={(entry, index) => (
              <ScriptLogEntry
                script={entry}
                index={index}
                isSelected={selectedScripts.has(index)}
                onToggleSelection={handleToggleSelection}
              />
            )}
            matcherFunc={(script, searchString) =>
              wordBeginningSubString(sanitizeScript(script), searchString)
            }
          >
            <FilterList.SearchResults.VirtualList gap={3} />
          </FilterList.SearchResults>
        </FilterList>
      </Layout.GrowingSection>
    </Layout>
  );
}
