import { useState } from 'react';
import { Button, Group, Progress, Stack, Stepper } from '@mantine/core';

import { Layout } from '@/components/Layout/Layout';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { GettingStartedSteps } from './GettingStartedSteps';
import { active } from 'd3';
import { FocusIcon, LeftClickMouseIcon, SceneIcon, TimerIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

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
        <Stepper iconSize={''} active={0} mt={'md'} onStepClick={() => {}}>
          <Stepper.Step
            label="Navigation"
            icon={<LeftClickMouseIcon size={IconSize.md} />}
          ></Stepper.Step>
          <Stepper.Step
            label="Time"
            icon={<TimerIcon size={IconSize.md} />}
          ></Stepper.Step>
          <Stepper.Step
            label="Content"
            icon={<SceneIcon size={IconSize.md} />}
          ></Stepper.Step>
          <Stepper.Completed>Fin</Stepper.Completed>
        </Stepper>
      </Layout.FixedSection>
    </Layout>
  );
}
