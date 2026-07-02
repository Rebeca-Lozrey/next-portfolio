"use client";

import { type ReactNode, useState } from "react";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import styles from "./ProductSection.module.css";

type Props = {
  title: string;
  children: ReactNode;
};

export default function ProductSection({ title, children }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className={styles.section}>
        <Collapsible.Trigger asChild>
          <button
            type="button"
            className={styles.trigger}
            id={title.toLowerCase().trim().replace(/\s+/g, "-")}
          >
            <span>{title}</span>

            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </button>
        </Collapsible.Trigger>

        <Collapsible.Content className={styles.content}>
          {children}
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
