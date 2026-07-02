import { Button, Text, TextField } from "@radix-ui/themes";
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";

import {
  ProductFormErrors,
  ProductFormValues,
} from "@/lib/modules/catalog/products/products.types";

import styles from "../ProductForm.module.css";
import sectionStyles from "./SpecificationsSection.module.css";

export default function SpecificationsSection({
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
    name: "specifications",
  });

  return (
    <div className={styles.fields}>
      {fields.map((field, index) => (
        <div key={field.id} className={sectionStyles.specificationRow}>
          <div>
            <TextField.Root {...register(`specifications.${index}.key`)} />
            {errors.specifications?.[index]?.key && (
              <Text color="red" size="1">
                {errors.specifications?.[index]?.key?.message}
              </Text>
            )}
          </div>
          <div>
            <TextField.Root {...register(`specifications.${index}.value`)} />
            {errors.specifications?.[index]?.value && (
              <Text color="red" size="1">
                {errors.specifications?.[index]?.value?.message}
              </Text>
            )}
          </div>
          <Button type="button" onClick={() => remove(index)} variant="soft">
            Remove
          </Button>
        </div>
      ))}
      {errors.specifications?.root && (
        <Text color="red" size="1">
          {errors.specifications?.root?.message}
        </Text>
      )}
      <div>
        <Button
          type="button"
          onClick={() => append({ key: "", value: "" })}
          variant="soft"
        >
          Add Specification
        </Button>
      </div>
    </div>
  );
}
