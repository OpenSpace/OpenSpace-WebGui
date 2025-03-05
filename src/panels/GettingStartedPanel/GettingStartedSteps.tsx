import { Text, Image, List, Stack } from '@mantine/core';
import React from 'react';
import { AltitudeTask } from './Tasks/AltitudeTask';

export const GettingStartedSteps: React.JSX.Element[] = [
  <Stack align="center">
    <Image src={'openspace-logo.png'} w={200} />
    <Text>Let's get started with exploring the observable Universe!</Text>
  </Stack>,
  <>
    <Text>In this tutorial we will cover the following topics:</Text>
    <List>
      <List.Item>Navigation</List.Item>
      <List.Item>Time</List.Item>
      <List.Item>Content</List.Item>
    </List>
  </>,
  <AltitudeTask />
];
