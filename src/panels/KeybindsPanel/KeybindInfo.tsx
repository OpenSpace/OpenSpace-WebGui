import { useTranslation } from 'react-i18next';
import { Badge, Code, Group, Paper, Table, Text } from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import { KeybindInfoType } from '@/types/types';

import { KeybindButtons } from './KeybindButtons';

interface Props {
  action: KeybindInfoType;
}

export function KeybindInfo({ action }: Props) {
  const { t } = useTranslation('panel-keybinds', { keyPrefix: 'keybind-info' });

  return (
    <Paper key={action.identifier} p={'sm'} maw={'800px'}>
      <Group justify={'space-between'} align={'center'} mb={'xs'}>
        <Text ml={'xs'} mb={2} fw={'bold'}>
          {action.name}
        </Text>
        <KeybindButtons selectedKey={action.key} modifiers={action.modifiers} />
      </Group>
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
