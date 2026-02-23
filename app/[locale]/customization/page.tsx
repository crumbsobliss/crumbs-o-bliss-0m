import { createClient } from "@/utils/supabase/server";
import CustomizationClient from "./CustomizationClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Studio & Packages | Crumbs O' Bliss",
  description: "Create your perfect custom cake, build a pizza, or explore our curated special packages.",
};

export default async function CustomizationPage() {
  const supabase = await createClient();

  // Fetch active custom catalogues with their items
  const { data: catalogues } = await supabase
    .from('custom_catalogues')
    .select(`
      id,
      name,
      description,
      image_url,
      catalogue_items (
        product_id,
        products (
          name,
          price
        )
      )
    `)
    .eq('is_active', true);

  return <CustomizationClient catalogues={catalogues || []} />;
}