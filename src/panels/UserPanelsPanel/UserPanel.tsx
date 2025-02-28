import { Flex } from '@mantine/core';

interface Props {
  src: string;
  title: string;
}

export function UserPanel({ src, title }: Props) {
  return (
    <>
      <Flex direction={'column'} h={'100vh'}>
        <iframe style={{ flexGrow: 11, border: 0 }} title={title} src={src} />
      </Flex>
    </>
  );
}
