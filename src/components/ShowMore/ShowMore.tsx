import { useTranslation } from 'react-i18next';
import { Spoiler, SpoilerProps } from '@mantine/core';

type Props = Omit<SpoilerProps, 'showLabel' | 'hideLabel'>;

export function ShowMore({ children, ...props }: Props) {
  const { t } = useTranslation('components', {
    keyPrefix: 'show-more'
  });

  return (
    <Spoiler
      showLabel={t('more')}
      hideLabel={t('less')}
      style={{ overflowWrap: 'anywhere' }}
      {...props}
    >
      {children}
    </Spoiler>
  );
}
