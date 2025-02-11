import { AspectRatio, Image, ImageProps, ThemeIcon } from '@mantine/core';

interface Props extends ImageProps {
  onClick: () => void;
  icon: JSX.Element;
  url: string;
}

export function IconImage({ url, onClick, icon, ...props }: Props) {
  return (
    <AspectRatio
      ratio={96 / 45}
      role={'button'}
      pos={'relative'}
      h={'100%'}
      miw={96}
      onClick={onClick}
      style={{ cursor: 'pointer', overflow: 'hidden' }}
    >
      <Image
        src={url}
        fallbackSrc={'placeholder.svg'}
        fit={'cover'}
        w={'100%'}
        h={'100%'}
        {...props}
      />
      <ThemeIcon pos={'absolute'} top={0} right={0} size={'sm'} variant={'default'}>
        {icon}
      </ThemeIcon>
    </AspectRatio>
  );
}
