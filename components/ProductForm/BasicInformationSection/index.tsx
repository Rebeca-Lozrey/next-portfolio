import { Text, TextField } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { Control, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Autocomplete } from "@/components/AutoComplete";
import { getAudienceOptionsRequest } from "@/lib/modules/catalog/audiences/audiences,api";
import { audiencesKeys } from "@/lib/modules/catalog/audiences/audiences.keys";
import { getBrandOptionsRequest } from "@/lib/modules/catalog/brands/brands.api";
import { brandsKeys } from "@/lib/modules/catalog/brands/brands.keys";
import { getCategoryOptionsRequest } from "@/lib/modules/catalog/categories/categories.api";
import { categoryKeys } from "@/lib/modules/catalog/categories/categories.keys";
import { getItemTypeOptionsRequest } from "@/lib/modules/catalog/itemTypes/itemTypes.api";
import { itemTypeKeys } from "@/lib/modules/catalog/itemTypes/itemTypes.keys";
import {
  ProductFormErrors,
  ProductFormValues,
} from "@/lib/modules/catalog/products/products.types";

import styles from "../ProductForm.module.css";

export default function BasicInformationSection({
  register,
  control,
  errors,
}: {
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues, unknown, ProductFormValues>;
  errors: ProductFormErrors;
}) {
  const itemTypeOptionsQuery = useQuery({
    queryFn: getItemTypeOptionsRequest,
    queryKey: itemTypeKeys.options,
  });
  const {
    data: itemTypeOptions = [],
    isLoading: itemTypesLoading,
    isError: itemTypesError,
  } = itemTypeOptionsQuery;

  const brandOptionsQuery = useQuery({
    queryFn: getBrandOptionsRequest,
    queryKey: brandsKeys.options,
  });
  const {
    data: brandOptions = [],
    isLoading: brandsLoading,
    isError: brandsError,
  } = brandOptionsQuery;

  const audienceOptionsQuery = useQuery({
    queryFn: getAudienceOptionsRequest,
    queryKey: audiencesKeys.options,
  });
  const {
    data: audienceOptions = [],
    isLoading: audiencesLoading,
    isError: audiencesError,
  } = audienceOptionsQuery;

  const categoryOptionsQuery = useQuery({
    queryFn: getCategoryOptionsRequest,
    queryKey: categoryKeys.options,
  });
  const {
    data: categoryOptions = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = categoryOptionsQuery;

  return (
    <div className={styles.fields}>
      <div className={styles.field}>
        <label htmlFor="title">Title</label>

        <TextField.Root id="title" {...register("title")} />
        {errors.title && (
          <Text color="red" size="1">
            {errors.title.message}
          </Text>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="slug">Slug</label>

        <TextField.Root id="slug" {...register("slug")} />
        {errors.slug && (
          <Text color="red" size="1">
            {errors.slug.message}
          </Text>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="itemTypeSlug">Item Type</label>
        <Controller
          control={control}
          name="itemTypeSlug"
          render={({ field, fieldState }) => (
            <>
              <Autocomplete
                options={itemTypeOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={itemTypesLoading || itemTypesError}
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

      <div className={styles.field}>
        <label htmlFor="audienceSlug">Audience</label>
        <Controller
          control={control}
          name="audienceSlug"
          render={({ field, fieldState }) => (
            <>
              <Autocomplete
                options={audienceOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={audiencesLoading || audiencesError}
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

      <div className={styles.field}>
        <label htmlFor="categorySlug">Category</label>
        <Controller
          control={control}
          name="categorySlug"
          render={({ field, fieldState }) => (
            <>
              <Autocomplete
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={categoriesLoading || categoriesError}
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

      <div className={styles.field}>
        <label htmlFor="brandSlug">Brand</label>
        <Controller
          control={control}
          name="brandSlug"
          render={({ field, fieldState }) => (
            <>
              <Autocomplete
                options={brandOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={brandsLoading || brandsError}
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
    </div>
  );
}
