import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@mantine/core';

import { RecordIcon } from '@/icons/icons';

interface Props extends ButtonProps {
  onClick: () => void;
}

export function RecordStartButton({ onClick, ...props }: Props) {
  const { t } = useTranslation('common');
  return (
    <Button onClick={onClick} leftSection={<RecordIcon color={'red'} />} {...props}>
      {t('record')}
    </Button>
  );
}
