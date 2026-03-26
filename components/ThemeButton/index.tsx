"use client";

import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";

import styles from "./ThemeButton.module.css";

export default function ThemeButton() {
  const { sunIcon, moonIcon, themeButton } = styles;
  const { theme, setTheme } = useTheme();

  return (
    <IconButton
      color="gray"
      variant="outline"
      highContrast
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={themeButton}
    >
      <SunIcon className={sunIcon} />
      <MoonIcon className={moonIcon} />
    </IconButton>
  );
}
