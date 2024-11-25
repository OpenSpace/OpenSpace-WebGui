import { Paper } from "@mantine/core";
import { CollapsableHeader } from "../CollapsableHeader/CollapsableHeader";

interface HeaderProps {
  expanded: boolean;
  label: React.ReactNode;
}

export function GroupHeader({ expanded, label }: HeaderProps) {
  return <CollapsableHeader expanded={expanded} text={label} />
};

export function PropertyOwnerHeader({ expanded, label }: HeaderProps) {
  return <Paper p={'1px'}>
    <CollapsableHeader expanded={expanded} text={label} />
  </Paper>
};
