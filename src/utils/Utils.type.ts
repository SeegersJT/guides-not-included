type StockVariant = "success" | "warning" | "destructive";
type StockIcon = "check" | "warning" | "none";

export interface StockAvailabilityItem {
  label: string;
  icon: StockIcon;
  variant: StockVariant;
}