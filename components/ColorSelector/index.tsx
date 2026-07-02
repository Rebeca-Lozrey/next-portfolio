import { useMemo, useState } from "react";

import { Cross2Icon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { Text } from "@radix-ui/themes";

import { ColorOption } from "@/lib/modules/catalog/colors/colors.types";

import styles from "./ColorSelector.module.css";

type Props = {
  value?: string;
  onChange: (slug?: string) => void;
  colors: ColorOption[];
  disabled: boolean;
};

export function ColorSelector({ value, onChange, colors, disabled }: Props) {
  const [open, setOpen] = useState(false);

  const selected = colors.find((c) => c.slug === value);

  const grouped = useMemo(() => {
    return colors.reduce<Record<string, ColorOption[]>>((acc, color) => {
      acc[color.group] ??= [];
      acc[color.group].push(color);
      return acc;
    }, {});
  }, [colors]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={styles.trigger}
          id="color-selector-trigger"
          aria-label="Toggle user menu open or close"
          disabled={disabled}
        >
          <div className={styles.triggerContent}>
            {selected ? (
              <>
                <span
                  className={styles.swatch}
                  style={{ background: selected.hex }}
                />
                <span className={styles.label}>{selected.name}</span>
              </>
            ) : (
              <span className={styles.placeholder}>Select color</span>
            )}
          </div>
          {selected && (
            <span
              role="button"
              tabIndex={0}
              className={styles.clearButton}
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
            >
              <Cross2Icon />
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Content side="bottom" align="start" className={styles.content}>
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className={styles.group}>
            <Text size="1" className={styles.groupLabel}>
              {group}
            </Text>

            <div className={styles.grid}>
              {items.map((color) => (
                <button
                  key={color.slug}
                  type="button"
                  title={color.name}
                  onClick={() => {
                    onChange(color.slug);
                    setOpen(false);
                  }}
                  className={styles.colorButton}
                  style={{ background: color.hex }}
                  data-selected={value === color.slug}
                />
              ))}
            </div>
          </div>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
}
