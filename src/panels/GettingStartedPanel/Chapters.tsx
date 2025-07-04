import { Stepper } from '@mantine/core';

import { AirplaneIcon, SceneIcon, TimerIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

export function Chapters({
  section,
  setSection
}: {
  setSection: (section: number) => void;
  section: number;
}) {
  return (
    <Stepper
      active={section}
      onStepClick={setSection}
      mb={'md'}
      styles={{
        stepBody: {
          display: 'none'
        },
        step: {
          padding: 0
        },
        stepIcon: {
          borderWidth: 4
        },
        separator: {
          marginLeft: -2,
          marginRight: -2,
          height: 6
        }
      }}
    >
      <Stepper.Step label={'Introduction'} />
      <Stepper.Step label={'Navigation'} icon={<AirplaneIcon size={IconSize.md} />} />
      <Stepper.Step label={'Time'} icon={<TimerIcon size={IconSize.md} />} />
      <Stepper.Step label={'Content'} icon={<SceneIcon size={IconSize.md} />} />
    </Stepper>
  );
}
