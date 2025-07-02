import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Divider, Group, Stack, Text, Title } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { KeybindInfoType } from '@/types/types';

import { FullKeyboard } from './FullKeyboard/FullKeyboard';
import { KeybindButtons } from './KeybindButtons';
import { KeybindInfo } from './KeybindInfo';

export function KeyboardLayout() {
  const [selectedActions, setSelectedActions] = useState<KeybindInfoType[]>([]);
  const [activeModifiers, setActiveModifiers] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');

  const { t } = useTranslation('panel-keybinds', { keyPrefix: 'keyboard-layout' });

  const hasSelectedKeys = selectedKey !== '' || activeModifiers.length > 0;
  return (
    <Container maw={'none'} h={'100%'}>
      <Layout>
        <Layout.FixedSection>
          <FullKeyboard
            setSelectedActions={setSelectedActions}
            setActiveModifiers={setActiveModifiers}
            setSelectedKey={setSelectedKey}
            selectedKey={selectedKey}
            activeModifiers={activeModifiers}
          />
        </Layout.FixedSection>

        <Layout.GrowingSection>
          <Group align={'top'}>
            <Stack>
              <Title order={2}>{t('selected-keybind-title')}:</Title>
              <KeybindButtons selectedKey={selectedKey} modifiers={activeModifiers} />
            </Stack>
            <Divider orientation={'vertical'} mx={'xs'} />
            <Stack flex={1} pr={'xs'}>
              <Group justify={'space-between'} align={'center'}>
                <Title order={2}>{t('mapped-actions-title')} :</Title>
                <Text c={'dimmed'} size={'lg'}>
                  ({selectedActions.length})
                </Text>
              </Group>
              {selectedActions.length > 0 ? (
                <Stack>
                  {selectedActions.map((selectedAction) => (
                    <KeybindInfo
                      key={selectedAction.identifier}
                      action={selectedAction}
                    />
                  ))}
                </Stack>
              ) : (
                <Text>
                  {hasSelectedKeys
                    ? t('no-mapped-action-text')
                    : t('no-key-selected-text')}
                </Text>
              )}
            </Stack>
          </Group>
        </Layout.GrowingSection>
      </Layout>
    </Container>
  );
}
