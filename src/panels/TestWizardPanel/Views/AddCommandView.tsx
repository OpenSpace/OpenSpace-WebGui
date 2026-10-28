import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Text, Title } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { Layout } from '@/components/Layout/Layout';
import { BackArrowIcon } from '@/icons/icons';

import { AddCommandForm } from '../AddCommandForm';
import { CommandType, TestCommand } from '../types';

interface Props {
  type: CommandType;
  onAdd: (command: TestCommand) => void;
  onCancel: () => void;
}

export function AddCommandView({ type, onAdd, onCancel }: Props) {
  const { t } = useTranslation('panel-testwizard');

  return (
    <Layout gap={'md'} pb={'md'}>
      <Layout.FixedSection>
        <Group gap={'xs'}>
          <ActionIcon
            variant={'subtle'}
            size={'sm'}
            onClick={onCancel}
            aria-label={t('buttons.back')}
          >
            <BackArrowIcon />
          </ActionIcon>
          <Title order={5}>
            {t('sections.add-command', {
              type: t(`add-command-form.types.${type}.label`)
            })}
          </Title>
          <InfoBox>
            <Text>{t(`add-command-form.types.${type}.description`)}</Text>
          </InfoBox>
        </Group>
      </Layout.FixedSection>
      <AddCommandForm type={type} onAdd={onAdd} onCancel={onCancel} />
    </Layout>
  );
}
