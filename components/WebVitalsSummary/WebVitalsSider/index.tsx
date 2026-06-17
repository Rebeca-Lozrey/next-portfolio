import { Dispatch, SetStateAction } from "react";

import { Slider } from "@radix-ui/themes";

import styles from "./WebVitalsSlider.module.css";

type props = {
  value: number[];
  setValue: Dispatch<SetStateAction<number[]>>;
  min: number;
  max: number;
};

export default function WebVitalsSlider({ value, setValue, min, max }: props) {
  const ToDateFormat = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className={styles.labels}>
        <div className={styles.from}>{ToDateFormat(new Date(min))}</div>
        <div className={styles.fromTo}>
          {ToDateFormat(new Date(value[0]))} -{" "}
          {ToDateFormat(new Date(value[1]))}
        </div>
        <div className={styles.to}>{ToDateFormat(new Date(max))}</div>
      </div>
      <div className={styles.slider}>
        <Slider
          min={min}
          max={max}
          step={1}
          size="3"
          variant="soft"
          color="indigo"
          highContrast
          onValueChange={(value) => setValue(value)}
          value={value}
        />
      </div>
    </div>
  );
}
