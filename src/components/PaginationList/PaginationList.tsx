import { useState } from 'react';
import { Pagination } from '@mantine/core';

interface Props<T> {
  data: T[];
  renderElement: (data: T, i: number) => React.ReactNode;
  itemsPerPage: number;
}

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

export function PaginationList<T>({ data, renderElement, itemsPerPage }: Props<T>) {
  const [activePage, setPage] = useState(1);

  const chunkedData = chunk(data, itemsPerPage);

  const items = chunkedData[activePage - 1].map((item: T, i: number) =>
    renderElement(item, i * itemsPerPage)
  );

  return (
    <>
      {items}
      <Pagination total={data.length} value={activePage} onChange={setPage} mt={'sm'} />
    </>
  );
}
