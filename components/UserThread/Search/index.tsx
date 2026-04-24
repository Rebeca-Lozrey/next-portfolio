import { ChangeEventHandler } from "react";

import styles from "./Search.module.css";

export default function Search({
  value,
  handleChange,
}: {
  value: string;
  handleChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
}) {
  return (
    <>
      <input
        className={styles.input}
        type="text"
        name="search"
        placeholder="search your articles..."
        value={value}
        onChange={handleChange}
      />
    </>
  );
}
