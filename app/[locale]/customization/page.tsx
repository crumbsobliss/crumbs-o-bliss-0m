import { createClient } from "@/utils/supabase/server";
import CustomizationClient from "./CustomizationClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Studio | Crumbs O' Bliss",
  description: "Create your perfect custom cake, build a pizza, or design a faux flower bouquet.",
};

export default async function CustomizationPage() {
  return <CustomizationClient />;
}