import { ActionsPanel } from '@/windowmanagement/data/LazyLoads';
import { Window } from '@/windowmanagement/Window/Window';

export function ActionsPage() {
  return (
    <Window h={window.innerHeight} w={window.innerWidth}>
      <ActionsPanel />
    </Window>
  );
}
