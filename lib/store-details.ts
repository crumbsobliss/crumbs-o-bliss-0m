import details from '@/config/details.json'

export const getStoreDetails = () => details

export const getStoreContact = () => details.contact

export const getStoreLocation = () => details.location

export const getStoreSocial = () => details.social

export const getStoreInfo = () => ({
  name: details.store.name,
  type: details.store.type,
  slogan: details.store.slogan,
  domain: details.store.domain,
})

export const getWhatsAppLink = (message?: string) => {
  const phone = details.contact.whatsappNumber
  const encodedMessage = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${phone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

export const getPhoneLink = () => {
  return `tel:${details.contact.primaryPhone.replace(/\s/g, '')}`
}

export const getEmailLink = () => {
  return `mailto:${details.contact.email}`
}

export const getGoogleMapsLink = () => {
  const { address, city, state, postalCode } = details.location
  const fullAddress = `${address}, ${city}, ${state} ${postalCode}`
  return `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`
}

export const getLocationString = () => {
  const { address, city, state, postalCode, landmark } = details.location
  return `${address}, ${city}, ${state} - ${postalCode} (${landmark})`
}
