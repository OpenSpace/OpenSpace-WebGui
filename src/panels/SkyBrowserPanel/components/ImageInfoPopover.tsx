import { useTranslation } from 'react-i18next';
import { ActionIcon, Button, Popover, Text } from '@mantine/core';

import { InformationIcon, OpenInBrowserIcon } from '@/icons/icons';

import { SkyBrowserImage } from '../types';

interface Props {
  image: SkyBrowserImage;
}

// @TODO anden88: 2025-04-14 this should be changed to the new clickable `InfoBox`
export function ImageInfoPopover({ image }: Props) {
  const { t } = useTranslation('panel-skybrowser', {
    keyPrefix: 'components.image-info'
  });

  return (
    <Popover width={200} position={'bottom'} withArrow shadow={'md'} trapFocus>
      <Popover.Target>
        <ActionIcon variant={'outline'} size={'xs'} aria-label={t('aria-label')}>
          <InformationIcon />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size={'sm'} fw={500}>
          {image.name}
        </Text>
        <Text size={'sm'} c={'dimmed'} lineClamp={10}>
          {image.credits}
        </Text>
        <Button
          component={'a'}
          size={'xs'}
          href={image.creditsUrl}
          target={'_blank'}
          variant={'outline'}
          mt={'md'}
        >
          <Text m={'xs'}>{t('label')}</Text>
          <OpenInBrowserIcon size={16} />
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
}
