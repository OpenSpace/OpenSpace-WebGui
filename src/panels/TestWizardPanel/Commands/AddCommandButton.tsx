import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export function AddCommandButton({ onClick, disabled }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  return (
    <Button onClick={onClick} disabled={disabled}>
      {t('submit')}
    </Button>
  );
}
