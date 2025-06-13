import React from 'react';
import { AspectRatio, Image, ImageProps, ThemeIcon, UnstyledButton } from '@mantine/core';

import styles from './IconImage.module.css';

interface Props extends ImageProps {
  onClick: () => void;
  icon: React.JSX.Element;
  url: string;
  h?: number | string;
  w?: number | string;
}

export function IconImage({ url, onClick, icon, h, w, ...props }: Props) {
  return (
    <UnstyledButton onClick={onClick} h={h} w={w} className={styles.iconImage}>
      <AspectRatio ratio={96 / 45} pos={'relative'}>
        <Image src={url} fallbackSrc={'/images/placeholder.svg'} {...props} />
        <ThemeIcon pos={'absolute'} top={0} right={0} size={'sm'}>
          {icon}
        </ThemeIcon>
      </AspectRatio>
    </UnstyledButton>
  );
}
