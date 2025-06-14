import { useTranslation } from 'react-i18next';
import { Badge, Code, Group, Paper, Table, Text } from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { Action } from '@/types/types';

interface Props {
  action: Action;
}

export function KeybindInfo({ action }: Props) {
  const { t } = useTranslation('panel-keybinds', { keyPrefix: 'keybind-info' });

  return (
    <Paper key={action.identifier} p={'sm'}>
      <Text ml={'xs'} mb={2} fw={'bold'}>
        {action.name}
      </Text>
      <Table
        data={{
          body: [
            [`${t('info')}:`, action.documentation],
            [
              `${t('is-local.title')}:`,
              action.isLocal ? (
                <Badge variant={'filled'}>{t('is-local.yes')}</Badge>
              ) : (
                <Badge variant={'outline'}>{t('is-local.no')}</Badge>
              )
            ],
            [`${t('gui-path')}:`, <Code>{action.guiPath}</Code>],
            [
              `${t('identifier')}:`,
              <Group gap={'xs'} wrap={'nowrap'}>
                <Code style={{ wordBreak: 'break-word' }}>{action.identifier}</Code>
                <CopyToClipboardButton value={action.identifier} />
              </Group>
            ]
          ]
        }}
      />
    </Paper>
  );
}
