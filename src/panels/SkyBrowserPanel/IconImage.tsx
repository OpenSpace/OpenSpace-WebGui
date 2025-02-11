import { AspectRatio, Image, ImageProps,ThemeIcon } from '@mantine/core';

interface Props extends ImageProps {
  handleClick: () => void;
  icon: JSX.Element;
  url: string;
}

export function IconImage({ url, handleClick, icon, ...props }: Props) {
  return (
    <AspectRatio
      ratio={96 / 45}
      role={"button"}
      pos={'relative'}
      flex={'0 0 150px'}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <Image src={url} fallbackSrc={'placeholder.svg'} fit={"cover"} {...props} />
      <ThemeIcon pos={'absolute'} top={0} right={0} size={'sm'} variant={"default"}>
        {icon}
      </ThemeIcon>
    </AspectRatio>
  );
}
