import { Flex } from '@mantine/core';

interface Props {
  src: string;
  title: string;
}

export function UserPage({ src, title }: Props) {
  // TODO ylvse 2024-12-04: Make this scroll work better
  return (
    <Flex direction={'column'} h={'100vh'}>
      <iframe style={{ flexGrow: 11, border: 0 }} title={title} src={src} />
    </Flex>
  );
}
