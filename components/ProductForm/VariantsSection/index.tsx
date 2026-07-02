import { Button, Text, TextField } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import {
  Control,
  Controller,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";

import { Autocomplete } from "@/components/AutoComplete";
import { ColorSelector } from "@/components/ColorSelector";
import { getColorOptionsRequest } from "@/lib/modules/catalog/colors/colors.api";
import { colorKeys } from "@/lib/modules/catalog/colors/colors.keys";
import {
  ProductFormErrors,
  ProductFormValues,
} from "@/lib/modules/catalog/products/products.types";
import { getSizeOptionsRequest } from "@/lib/modules/catalog/sizes/sizes,api";
import { sizesKeys } from "@/lib/modules/catalog/sizes/sizes.keys";

import styles from "../ProductForm.module.css";
import sectionStyles from "./VariantsSection.module.css";

export default function VariantsSection({
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
    name: "variants",
  });

  const brandOptionsQuery = useQuery({
    queryFn: getColorOptionsRequest,
    queryKey: colorKeys.options,
  });
  const {
    data: colorOptions = [],
    isLoading: colorsLoading,
    isError: colorsError,
  } = brandOptionsQuery;

  const sizeOptionsQuery = useQuery({
    queryFn: getSizeOptionsRequest,
    queryKey: sizesKeys.options,
  });
  const {
    data: sizeOptions = [],
    isLoading: sizesLoading,
    isError: sizesError,
  } = sizeOptionsQuery;

  return (
    <div className={styles.fields}>
      {fields.map((field, index) => (
        <div key={field.id} className={sectionStyles.variantsCard}>
          <div className={sectionStyles.field}>
            <label>SKU</label>
            <TextField.Root
              type="text"
              {...register(`variants.${index}.sku`)}
            />
            {errors.variants?.[index]?.sku && (
              <Text color="red" size="1">
                {errors.variants?.[index]?.sku?.message}
              </Text>
            )}
          </div>

          <div className={sectionStyles.field}>
            <label>Price</label>
            <TextField.Root
              type="number"
              min={0}
              {...register(`variants.${index}.price`, {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            {errors.variants?.[index]?.price && (
              <Text color="red" size="1">
                {errors.variants?.[index]?.price?.message}
              </Text>
            )}
          </div>

          <div className={sectionStyles.field}>
            <label>Stock</label>
            <TextField.Root
              type="number"
              min={0}
              {...register(`variants.${index}.stock`, {
                setValueAs: (v) => (v === "" ? undefined : Number(v)),
              })}
            />
            {errors.variants?.[index]?.stock && (
              <Text color="red" size="1">
                {errors.variants?.[index]?.stock?.message}
              </Text>
            )}
          </div>

          <div className={sectionStyles.field}>
            <label>Color</label>
            <Controller
              control={control}
              name={`variants.${index}.attributes.colorSlug`}
              render={({ field }) => (
                <ColorSelector
                  value={field.value}
                  onChange={field.onChange}
                  colors={colorOptions}
                  disabled={colorsLoading || !!colorsError}
                />
              )}
            />
            {errors.variants?.[index]?.attributes?.colorSlug && (
              <Text color="red" size="1">
                {errors.variants?.[index]?.attributes?.colorSlug?.message}
              </Text>
            )}
          </div>

          <div className={sectionStyles.field}>
            <label>Size</label>
            <Controller
              control={control}
              name={`variants.${index}.attributes.sizeSlug`}
              render={({ field, fieldState }) => (
                <>
                  <Autocomplete
                    options={sizeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={sizesLoading || !!sizesError}
                  />

                  {fieldState.error && (
                    <Text color="red" size="1">
                      {fieldState.error.message}
                    </Text>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <Button type="button" onClick={() => remove(index)} variant="soft">
              Remove
            </Button>
          </div>
        </div>
      ))}
      <div>
        <Button
          type="button"
          onClick={() =>
            append({
              sku: "",
              price: 0,
              stock: 0,
              attributes: { sizeSlug: "", colorSlug: "" },
            })
          }
          variant="soft"
        >
          Add Variant
        </Button>
      </div>
    </div>
  );
}
