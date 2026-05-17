import useConfiguratorStore from "../store/configurator-store.js";

export default function PriceDisplay() {
  const price = useConfiguratorStore((s) => s.price);
  const currency = useConfiguratorStore((s) => s.currency);

  // Fiyat henüz çekilmemişse bekleme göstergesi — sidebar sadece
  // loading:false && !error durumunda render edildiğinden bu state,
  // WCF hazır ama pricing procedure henüz tamamlanmamışken görünür.
  if (price == null) {
    return (
      <div className="pcon-price pcon-price--pending">
        <span className="pcon-price__label">List Price</span>
        <span className="pcon-price__value pcon-price__value--pending" aria-busy="true">
          <span className="pcon-price__skeleton" />
        </span>
      </div>
    );
  }

  let formatted;
  try {
    formatted = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: 2,
    }).format(price);
  } catch {
    // Bilinmeyen currency kodu gelirse düz format kullan
    formatted = `${Number(price).toFixed(2)} ${currency || "EUR"}`;
  }

  return (
    <div className="pcon-price">
      <span className="pcon-price__label">List Price</span>
      <span className="pcon-price__value">{formatted}</span>
    </div>
  );
}
