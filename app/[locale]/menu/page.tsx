
import { createClient } from "@/utils/supabase/server";
import MenuClient, { MenuItem } from "./MenuClient";

export default async function MenuPage() {
  const supabase = await createClient();

  const { data: specialImages } = await supabase
    .from('special_images')
    .select('*')
    .eq('category', 'menu')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const menuPages: MenuItem[] = specialImages?.map((img: any) => ({
    id: img.id,
    title: img.name,
    subtitle: img.description || '', // Using description as subtitle for aesthetics
    url: img.image_url,
    description: img.description || img.name
  })) || [];

  return <MenuClient menuPages={menuPages} />;
}