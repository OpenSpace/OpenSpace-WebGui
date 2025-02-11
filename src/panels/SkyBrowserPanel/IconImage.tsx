import {
  AspectRatio,
  AspectRatioProps,
  Image,
  MantineRadius,
  ThemeIcon
} from '@mantine/core';

interface Props extends AspectRatioProps {
  onClick: () => void;
  icon: JSX.Element;
  url: string;
  radius: MantineRadius;
}

export function IconImage({ url, onClick, icon, radius, ...props }: Props) {
  return (
    <AspectRatio
      ratio={96 / 45}
      role={'button'}
      pos={'relative'}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      {...props}
    >
      <Image src={url} fallbackSrc={'placeholder.svg'} fit={'cover'} radius={radius} />
      <ThemeIcon pos={'absolute'} top={0} right={0} size={'sm'}>
        {icon}
      </ThemeIcon>
    </AspectRatio>
  );
}
