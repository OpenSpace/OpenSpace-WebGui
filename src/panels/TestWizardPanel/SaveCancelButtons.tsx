import { useTranslation } from 'react-i18next';
import { Button, Group } from '@mantine/core';

interface Props {
  onSave: () => void;
  onCancel: () => void;
  saveDisabled?: boolean;
  saveLabel?: 'save' | 'add';
}

export function SaveCancelButtons({
  onSave,
  onCancel,
  saveDisabled,
  saveLabel = 'save'
}: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'buttons' });

  return (
    <Group grow>
      <Button variant={'default'} onClick={onCancel}>
        {t('cancel')}
      </Button>
      <Button variant={'filled'} onClick={onSave} disabled={saveDisabled}>
        {t(saveLabel)}
      </Button>
    </Group>
  );
}
