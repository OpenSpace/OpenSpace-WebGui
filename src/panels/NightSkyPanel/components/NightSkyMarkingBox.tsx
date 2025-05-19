import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import {
  AbcIcon,
  BandIcon,
  CompassLargeIcon,
  CompassMarksIcon,
  CompassSmallIcon,
  HomeIcon,
  LineIcon,
  PaintBrushIcon,
  PencilIcon,
  SingleDotIcon,
  SphereIcon
} from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { ToggleCard } from './ToggleCard';

interface Props {
  title: string;
  icon: string;
  identifier: string;
  onAction?: string;
  offAction?: string;
  boolProp?: string;
  directionCheck?: string;
}

export function NightSkyMarkingBox({ title, icon, identifier }: Props) {
  const uri = 'Scene.' + identifier + '.Renderable';
  function getDisplayIcon(icon: string) {
    switch (icon) {
      case 'grid':
        return <SphereIcon size={IconSize.md} />;
      case 'line':
        return <LineIcon size={IconSize.md} />;
      case 'dot':
        return <SingleDotIcon size={IconSize.md} />;
      case 'text':
        return <AbcIcon size={IconSize.md} />;
      case 'band':
        return <BandIcon size={IconSize.md} />;
      case 'compasssmall':
        return <CompassSmallIcon size={IconSize.md} />;
      case 'compasslarge':
        return <CompassLargeIcon size={IconSize.md} />;
      case 'compassmarks':
        return <CompassMarksIcon size={IconSize.md} />;
      case 'pencil':
        return <PencilIcon size={IconSize.md} />;
      case 'paint':
        return <PaintBrushIcon size={IconSize.md} />;
      default:
        return <HomeIcon size={IconSize.md} />;
    }
  }

  return (
    <ToggleCard
      checkbox={<PropertyOwnerVisibilityCheckbox uri={uri} />}
      title={title}
      icon={getDisplayIcon(icon)}
    />
  );
}
