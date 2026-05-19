import useConfiguratorStore from "../store/configurator-store.js";

/** Tutarı verilen currency ile formatlar; hata durumunda düz metin döner. */
function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${Number(amount).toFixed(2)} ${currency || "EUR"}`;
  }
}

export default function PriceDisplay() {
  const price = useConfiguratorStore((s) => s.price);
  const currency = useConfiguratorStore((s) => s.currency);
  const discountPercentage = useConfiguratorStore((s) => s.discountPercentage);

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

  const formatted = formatCurrency(price, currency);

  // Discount hesaplama — yalnızca metafield değeri geçerliyse gösterilir.
  // discountAmount: indirim tutarı, yukarı yuvarlanmış (Math.ceil)
  // netPrice: list price - discountAmount
  const hasDiscount =
    discountPercentage != null &&
    discountPercentage > 0 &&
    discountPercentage < 100;

  let discountAmount = null;
  let netPrice = null;

  if (hasDiscount) {
    // Discount tutarı: list price × oran, kuruş hassasiyetiyle yukarı yuvarla
    discountAmount = Math.ceil(price * (discountPercentage / 100) * 100) / 100;
    netPrice = price - discountAmount;
  }

  return (
    <div className="pcon-price-block">
      <div className="pcon-price">
        <span className="pcon-price__label">List Price</span>
        <span className="pcon-price__value">{formatted}</span>
      </div>

      {hasDiscount && (
        <>
          <div className="pcon-price pcon-price--discount">
            <span className="pcon-price__label">
              Discount ({discountPercentage}%)
            </span>
            <span className="pcon-price__value pcon-price__value--discount">
              {formatCurrency(discountAmount, currency)}
            </span>
          </div>

          <div className="pcon-price pcon-price--net">
            <span className="pcon-price__label">Net Price</span>
            <span className="pcon-price__value pcon-price__value--net">
              {formatCurrency(netPrice, currency)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
