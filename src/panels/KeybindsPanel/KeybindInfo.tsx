import { useTranslation } from 'react-i18next';
import { Badge, Code, Group, Paper, Table, Text } from '@mantine/core';

import { CopyToClipboardButton } from '@/components/CopyToClipboardButton/CopyToClipboardButton';
import styles from '@/theme/global.module.css';
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
        <Text ml={'xs'} mb={2} fw={'bold'} className={styles.selectable}>
          {action.name}
        </Text>
        <KeybindButtons selectedKey={action.key} modifiers={action.modifiers} />
      </Group>
      <Table
        data={{
          body: [
            [
              <Text size={'sm'}>{t('info')}:</Text>,
              <Text size={'sm'} className={styles.selectable}>
                {action.documentation}
              </Text>
            ],
            [
              <Text size={'sm'}>{t('is-local.title')}:</Text>,
              action.isLocal ? (
                <Badge variant={'filled'}>{t('is-local.yes')}</Badge>
              ) : (
                <Badge variant={'outline'}>{t('is-local.no')}</Badge>
              )
            ],
            [
              <Text size={'sm'}>{t('gui-path')}:</Text>,
              <Code className={styles.selectable}>{action.guiPath}</Code>
            ],
            [
              <Text size={'sm'}>{t('identifier')}:</Text>,
              <Group gap={'xs'} wrap={'nowrap'}>
                <Code className={styles.selectable} style={{ wordBreak: 'break-word' }}>
                  {action.identifier}
                </Code>
                <CopyToClipboardButton value={action.identifier} />
              </Group>
            ]
          ]
        }}
      />
    </Paper>
  );
}
