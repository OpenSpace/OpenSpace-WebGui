import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Text, Title } from '@mantine/core';

import { InfoBox } from '@/components/InfoBox/InfoBox';
import { Layout } from '@/components/Layout/Layout';
import { BackArrowIcon } from '@/icons/icons';

import { CommandForm } from '../CommandForm';
import { CommandType, TestCommand } from '../types';

interface Props {
  type: CommandType;
  onSubmit: (command: TestCommand) => void;
  onCancel: () => void;
  initialCommand?: TestCommand;
}

export function CommandFormView({ type, onSubmit, onCancel, initialCommand }: Props) {
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
            {t(initialCommand ? 'sections.edit-command' : 'sections.add-command', {
              type: t(`command-form.types.${type}.label`)
            })}
          </Title>
          <InfoBox>
            <Text>{t(`command-form.types.${type}.description`)}</Text>
          </InfoBox>
        </Group>
      </Layout.FixedSection>
      <CommandForm
        type={type}
        onSubmit={onSubmit}
        onCancel={onCancel}
        initialCommand={initialCommand}
      />
    </Layout>
  );
}
