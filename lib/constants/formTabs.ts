export const FORM_TABS = [
  { id: "contact", label: "Contact" },
  { id: "car", label: "Car Info" },
  { id: "specs", label: "Specifications" },
  { id: "features", label: "Features" },
  { id: "media", label: "Media" },
] as const;

export type FormTab = typeof FORM_TABS[number]["id"];