import {
  Box,
  Checkbox,
  CheckboxCardProps,
  Group,
  Radio,
  RadioCardProps,
  Skeleton,
  Stack,
  Text
} from '@mantine/core';

interface BaseProps {
  title: string;
  icon: React.JSX.Element;
  isLoading?: boolean;
  onClick: () => void;
  checked: boolean;
}

interface CheckboxProps
  extends BaseProps,
    Omit<CheckboxCardProps, 'checked' | 'onClick' | 'title'> {
  radio?: false;
}

interface RadioProps
  extends BaseProps,
    Omit<RadioCardProps, 'checked' | 'onClick' | 'title'> {
  radio: true;
}

type Props = CheckboxProps | RadioProps;

export function MarkingBoxLayout({
  title,
  icon,
  isLoading,
  onClick,
  checked,
  radio = false,
  ...other
}: Props) {
  const CardComponent = radio ? Radio.Card : Checkbox.Card;
  const Indicator = radio ? Radio.Indicator : Checkbox.Indicator;

  return (
    <Box flex={'0 0 1'} miw={100}>
      <Skeleton visible={isLoading}>
        <CardComponent
          checked={checked}
          onClick={onClick}
          p={'xs'}
          bg={'dark.8'}
          {...other}
        >
          <Group wrap={'nowrap'} align={'center'} gap={'xs'}>
            <Indicator />
            <Stack gap={2} align={'center'} flex={1}>
              {icon}
              <Text>{title}</Text>
            </Stack>
          </Group>
        </CardComponent>
      </Skeleton>
    </Box>
  );
}
