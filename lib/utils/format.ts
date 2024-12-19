export function formatPrice(price: number | string) {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatPhoneNumber(phone: string) {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format UK phone numbers
  if (cleaned.startsWith('44')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
  }
  
  // Default formatting
  return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}