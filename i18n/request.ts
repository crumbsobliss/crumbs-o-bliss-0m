import { getRequestConfig } from "next-intl/server"
import config from "@/i18n"

export default getRequestConfig(async ({ locale }) => {
  if (!config.locales.includes(locale as any)) {
    return {}
  }

  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})
