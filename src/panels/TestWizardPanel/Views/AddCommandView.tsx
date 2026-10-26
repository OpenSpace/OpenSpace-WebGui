import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, Stack, Title } from '@mantine/core';

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
    <Stack gap={'md'}>
      <Group gap={'xs'}>
        <ActionIcon
          variant={'subtle'}
          size={'lg'}
          onClick={onCancel}
          aria-label={t('buttons.back')}
        >
          <BackArrowIcon />
        </ActionIcon>
        <Title order={4}>
          {t('sections.add-command', { type: t(`add-command-form.types.${type}.label`) })}
        </Title>
      </Group>
      <AddCommandForm type={type} onAdd={onAdd} onCancel={onCancel} />
    </Stack>
  );
}
