import useConfiguratorStore from "../store/configurator-store.js";

export default function PriceDisplay() {
  const price = useConfiguratorStore((s) => s.price);
  const currency = useConfiguratorStore((s) => s.currency);

  if (price == null) return null;

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "TRY",
    minimumFractionDigits: 2,
  }).format(price);

  return <div className="pcon-price">{formatted}</div>;
}
