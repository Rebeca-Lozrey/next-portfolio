"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@radix-ui/themes";
import { useForm } from "react-hook-form";

import { productFormSchema } from "@/lib/modules/catalog/products/products.schema";
import { ProductFormValues } from "@/lib/modules/catalog/products/products.types";

import BasicInformationSection from "./BasicInformationSection";
import styles from "./ProductForm.module.css";
import ProductSection from "./ProductSection";
import SpecificationsSection from "./SpecificationsSection";
import TagsSection from "./TagsSection";
import VariantsSection from "./VariantsSection";

export default function ProductForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      tags: [{ value: "" }],
      specifications: [{ key: "", value: "" }],
      variants: [
        {
          sku: "",
          price: 0,
          stock: 0,
          attributes: { colorSlug: "", sizeSlug: "" },
        },
      ],
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <ProductSection title={"Basic Information"}>
        <BasicInformationSection
          register={register}
          errors={errors}
          control={control}
        />
      </ProductSection>
      <ProductSection title={"Tags"}>
        <TagsSection register={register} control={control} errors={errors} />
      </ProductSection>
      <ProductSection title={"Specifications"}>
        <SpecificationsSection
          register={register}
          control={control}
          errors={errors}
        />
      </ProductSection>
      <ProductSection title={"Variants"}>
        <VariantsSection
          register={register}
          control={control}
          errors={errors}
        />
      </ProductSection>
      <div>
        <Button type="submit" variant="soft">
          Save Product
        </Button>
      </div>
    </form>
  );
}
