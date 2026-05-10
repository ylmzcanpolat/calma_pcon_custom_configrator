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

  return (
    <div className="pcon-price">
      <span className="pcon-price__label">List Price</span>
      <span className="pcon-price__value">{formatted}</span>
    </div>
  );
}
