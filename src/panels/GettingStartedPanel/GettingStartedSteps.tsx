import React from 'react';
import { Anchor, Image, List, Stack, Text } from '@mantine/core';

import { NavigationSteps } from './Steps/NavigationSteps';
import { TimeSteps } from './Steps/TimeSteps';
import { ContentSteps } from './Steps/ContentSteps';

export const GettingStartedSteps: React.JSX.Element[] = [
  <Stack align={'center'}>
    <Image src={'openspace-logo.png'} w={200} my={'lg'} />
    <Text size={'lg'}>Let's get started with exploring the observable Universe!</Text>
  </Stack>,
  <>
    <Text>In this tutorial we will cover the following topics:</Text>
    <List>
      <List.Item>Navigation</List.Item>
      <List.Item>Time</List.Item>
      <List.Item>Content</List.Item>
    </List>
  </>,
  ...NavigationSteps,
  <Text>
    Great! Now you know the basics of navigation. Let's start changing the time!
  </Text>,
  ...TimeSteps,
  <>
    <Text>
      Fantastic! Now you can move around in both space and time. Let's look at some
      content!
    </Text>
  </>,
  ...ContentSteps,
  <>
    <Text>
      Well done! Now you are ready to explore the Universe on your own. Some ideas to get
      you started:
    </Text>
    <List>
      <List.Item>Go to your home town</List.Item>
      <List.Item>Go to the end of the Universe</List.Item>
      <List.Item>Turn on the Sun's orbit in the Milky Way</List.Item>
    </List>
    <Text>
      Click{' '}
      <Anchor
        href={'https://www.youtube.com/playlist?list=PLzXWit_1TXsu23I8Nh2WZhN9msWG_ZbnV'}
        target={'_blank'}
      >
        here
      </Anchor>{' '}
      for more in-depth tutorials.
    </Text>
  </>
];
