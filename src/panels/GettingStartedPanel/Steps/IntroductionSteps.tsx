import React from 'react';
import { Image, List, Stack, Text } from '@mantine/core';
import { TaskCheckbox } from '../Tasks/Components/TaskCheckbox';

export const IntroductionSteps: React.JSX.Element[] = [
  <Stack align={'center'}>
    <Image src={'openspace-logo.png'} w={200} h={300} my={'lg'} />
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
  <>
    <Text>
      In each section, there will be some tasks designed to teach you how to use
      OpenSpace. Once you have fulfilled the task, the checkbox will be marked as
      completed.
    </Text>
    <TaskCheckbox taskCompleted={false} label="This is a task!" />
    <TaskCheckbox taskCompleted={true} label="This is a completed task!" />
  </>,
  <>Let's dive right in!</>
];
