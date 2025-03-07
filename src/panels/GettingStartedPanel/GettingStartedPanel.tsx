import { useState } from 'react';
import { Button, Group, Progress, Stack } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { GettingStartedSteps } from './GettingStartedSteps';
export function GettingStartedPanel() {
  const [step, setStep] = useState(0);
  const { closeWindow } = useWindowLayoutProvider();

  const progress = (step / (GettingStartedSteps.length - 1)) * 100;
  const isLastStep = step == GettingStartedSteps.length - 1;

  function onClickNext() {
    if (isLastStep) {
      closeWindow('gettingStartedTour');
    } else {
      setStep(step + 1);
    }
  }

  return (
    <Layout>
      <Layout.GrowingSection>
        <Stack gap={'xs'} h={'100%'} style={{ overflowY: 'auto' }} p={'md'}>
          {GettingStartedSteps[step]}
        </Stack>
      </Layout.GrowingSection>

      <Layout.FixedSection>
        <Group justify={'space-between'}>
          <Button onClick={() => setStep(step - 1)} disabled={step == 0}>
            Previous
          </Button>
          <Button onClick={onClickNext} variant={'filled'}>
            {isLastStep ? 'Finish' : 'Next'}
          </Button>
        </Group>
        <Progress value={progress} mt={'md'}></Progress>
      </Layout.FixedSection>
    </Layout>
  );
}
