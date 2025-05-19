import { ActionIcon, MantineStyleProps, Text, Tooltip } from '@mantine/core';

import { MinusIcon, PlusIcon } from '@/icons/icons';

interface Props extends MantineStyleProps {
  /**
   * Label for the minus button, used for tooltip and aria-label
   */
  minusLabel: string;
  /**
   * Label for the plus button, used for tooltip and aria-label
   */
  plusLabel: string;
  centerLabel?: string;
  onClickMinus?: () => void;
  onClickPlus?: () => void;
  minusIcon?: React.ReactNode;
  plusIcon?: React.ReactNode;
}

export function PlusMinusActionGroup({
  minusLabel,
  plusLabel,
  centerLabel,
  onClickMinus,
  onClickPlus,
  minusIcon,
  plusIcon,
  ...styleProps
}: Props) {
  return (
    <ActionIcon.Group {...styleProps}>
      <Tooltip label={minusLabel}>
        <ActionIcon onClick={onClickMinus} aria-label={minusLabel} size={'lg'}>
          {minusIcon || <MinusIcon />}
        </ActionIcon>
      </Tooltip>
      {centerLabel && (
        <ActionIcon.GroupSection
          variant={'default'}
          bg={'var(--mantine-color-body)'}
          size={'lg'}
        >
          <Text size={'sm'}>{centerLabel}</Text>
        </ActionIcon.GroupSection>
      )}
      <Tooltip label={plusLabel}>
        <ActionIcon onClick={onClickPlus} aria-label={plusLabel} size={'lg'}>
          {plusIcon || <PlusIcon />}
        </ActionIcon>
      </Tooltip>
    </ActionIcon.Group>
  );
}
