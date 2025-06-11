import { useEffect, useState } from 'react';

import { useProperty } from '@/hooks/properties';

/**
 * @returns The Web GUI URL using the address and port properties, falling back to
 * localhost:4680 if not available.
 */
export function useWebGuiUrl(): string {
  const [portProperty] = useProperty('IntProperty', 'Modules.WebGui.Port');
  const [addressProperty] = useProperty('StringProperty', 'Modules.WebGui.Address');
  const [link, setLink] = useState('http://localhost:4680');

  useEffect(() => {
    const port = portProperty ?? 4680;
    const address = addressProperty ?? 'localhost';
    setLink(`http://${address}:${port}`);
  }, [portProperty, addressProperty]);

  return link;
}
