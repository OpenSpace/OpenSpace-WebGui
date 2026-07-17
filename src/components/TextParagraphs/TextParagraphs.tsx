import { Text, TextProps } from '@mantine/core';

interface Props extends TextProps {
  paragraphs: string[];
}

export function TextParagraphs({ paragraphs, ...textProps }: Props) {
  return (
    <>
      {paragraphs.map((paragraph, index, array) => (
        <Text key={index} mb={index === array.length - 1 ? 0 : 'xs'} {...textProps}>
          {paragraph}
        </Text>
      ))}
    </>
  );
}
