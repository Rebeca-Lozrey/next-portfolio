import { Button, Text, TextField } from "@radix-ui/themes";
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";

import {
  ProductFormErrors,
  ProductFormValues,
} from "@/lib/modules/catalog/products/products.types";

import styles from "../ProductForm.module.css";
import sectionStyles from "./TagsSection.module.css";

export default function TagsSection({
  control,
  register,
  errors,
}: {
  control: Control<ProductFormValues, unknown, ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: ProductFormErrors;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });
  return (
    <div className={styles.fields}>
      {fields.map((field, index) => (
        <div key={field.id} className={sectionStyles.tagRow}>
          <div>
            <TextField.Root {...register(`tags.${index}.value`)} />

            {errors.tags?.[index]?.value && (
              <Text color="red" size="1">
                {errors.tags?.[index]?.value?.message}
              </Text>
            )}
          </div>

          <Button type="button" onClick={() => remove(index)} variant="soft">
            Remove
          </Button>
        </div>
      ))}
      {errors.tags?.root && (
        <Text color="red" size="1">
          {errors.tags?.root?.message}
        </Text>
      )}
      <div>
        <Button
          type="button"
          onClick={() => append({ value: "" })}
          variant="soft"
        >
          Add Tag
        </Button>
      </div>
    </div>
  );
}
