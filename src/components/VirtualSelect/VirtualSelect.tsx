import { useMemo, useRef, useState } from 'react';
import { Box, Combobox, InputBase, Text, useCombobox } from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';

const OptionHeight = 32;
const MaxListHeight = 220;

interface VirtualOptionsProps {
  data: string[];
  selected: string;
}

function VirtualOptions({ data, selected }: VirtualOptionsProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => OptionHeight,
    overscan: 5
  });

  return (
    <Box ref={parentRef} mah={MaxListHeight} style={{ overflowY: 'auto' }}>
      <Box h={`${virtualizer.getTotalSize()}px`} pos={'relative'} w={'100%'}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const option = data[virtualRow.index];
          return (
            <Combobox.Option
              key={option}
              value={option}
              active={option === selected}
              title={option}
              pos={'absolute'}
              top={0}
              left={0}
              w={'100%'}
              h={OptionHeight}
              py={4}
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <Text size={'sm'} truncate>
                {option}
              </Text>
            </Combobox.Option>
          );
        })}
      </Box>
    </Box>
  );
}

interface Props {
  data: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  nothingFoundMessage?: string;
}

/**
 * A searchable select that only renders the options in view, for long lists of options.
 * Arrow key navigation only moves between the options currently rendered.
 */
export function VirtualSelect({
  data,
  value,
  onChange,
  label,
  placeholder,
  nothingFoundMessage
}: Props) {
  // `null` when the user is not typing, in which case the selected value is shown
  const [search, setSearch] = useState<string | null>(null);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  });

  const filteredData = useMemo(() => {
    if (search === null) {
      return data;
    }
    const lowerCaseSearch = search.toLowerCase().trim();
    return data.filter((option) => option.toLowerCase().includes(lowerCaseSearch));
  }, [data, search]);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(option) => {
        onChange(option);
        setSearch(null);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          placeholder={placeholder}
          value={search ?? value}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(null);
          }}
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents={'none'}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {filteredData.length === 0 ? (
            <Combobox.Empty>{nothingFoundMessage}</Combobox.Empty>
          ) : (
            <VirtualOptions data={filteredData} selected={value} />
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
