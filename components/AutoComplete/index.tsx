import { useMemo, useState } from "react";

import { Cross2Icon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { TextField } from "@radix-ui/themes";

import styles from "./AutoComplete.module.css";

type Option = {
  slug: string;
  name: string;
};

type Props = {
  options: Option[];
  value?: string;
  onChange: (slug: string) => void;
  placeholder?: string;
  disabled: boolean;
};

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.slug === value);

  const filtered = useMemo(() => {
    if (!query) return options;

    return options.filter((o) =>
      o.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [options, query]);

  const inputValue = open || query.length > 0 ? query : (selected?.name ?? "");

  const handleClear = () => {
    onChange("");
    setQuery("");
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <TextField.Root
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
        >
          {selected && query.length === 0 && (
            <TextField.Slot side="right">
              <button
                type="button"
                className={styles.clearButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClear();
                }}
                aria-label="Clear selection"
              >
                <Cross2Icon />
              </button>
            </TextField.Slot>
          )}
        </TextField.Root>
      </Popover.Anchor>

      <Popover.Content
        className={styles.content}
        side="bottom"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {filtered.length === 0 && (
          <div className={styles.empty}>No results</div>
        )}

        {filtered.map((option) => (
          <button
            key={option.slug}
            type="button"
            className={styles.option}
            onClick={() => {
              onChange(option.slug);
              setQuery("");
              setOpen(false);
            }}
          >
            {option.name}
          </button>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
}
