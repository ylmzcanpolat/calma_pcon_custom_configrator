import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useConfiguratorStore from "../store/configurator-store.js";

/**
 * @param {{ isGuest?: boolean }} props
 *   isGuest=false (dealer): "Add to Request" + "Add to Cart" iki buton gösterilir.
 *     - "Add to Request": fiyatsız Excel indirir, sepete ekleme yapmaz.
 *     - "Add to Cart": sepete ekler, tema'nın cart drawer'ını açar.
 *   isGuest=true (guest): tek "Request a Quote" butonu — sepete ekler + cart drawer açar.
 */
/**
 * window.CalmaQuoteList.addItem mevcut mu kontrol eder.
 * Bayi (dealer) girişi yapıldığında mağaza scripti bu global'i yükler.
 */
function isQuoteApiReady() {
  return (
    typeof window !== "undefined" &&
    window.CalmaQuoteList &&
    typeof window.CalmaQuoteList.addItem === "function"
  );
}

export default function AddToCartButton({ isGuest = false }) {
  const quantity = useConfiguratorStore((s) => s.quantity);
  const setQuantity = useConfiguratorStore((s) => s.setQuantity);
  const addToCart = useConfiguratorStore((s) => s.addToCart);
  const addToQuoteList = useConfiguratorStore((s) => s.addToQuoteList);
  const exportRequest = useConfiguratorStore((s) => s.exportRequest);
  const resetCartFeedback = useConfiguratorStore((s) => s.resetCartFeedback);
  const resetQuoteFeedback = useConfiguratorStore((s) => s.resetQuoteFeedback);
  const cartLoading = useConfiguratorStore((s) => s.cartLoading);
  const cartError = useConfiguratorStore((s) => s.cartError);
  const cartSuccess = useConfiguratorStore((s) => s.cartSuccess);
  const quoteLoading = useConfiguratorStore((s) => s.quoteLoading);
  const quoteError = useConfiguratorStore((s) => s.quoteError);
  const quoteSuccess = useConfiguratorStore((s) => s.quoteSuccess);
  const cartProperties = useConfiguratorStore((s) => s.cartProperties);
  const variantId = useConfiguratorStore((s) => s.variantId);
  const updating = useConfiguratorStore((s) => s.updating);
  const loading = useConfiguratorStore((s) => s.loading);
  const addToCartLabel = useConfiguratorStore((s) => s.addToCartLabel);

  // "Add to Request" için yerel loading state (Excel oluşturma sırasında)
  const [exporting, setExporting] = useState(false);

  // Teklif listesi API'si yüklü mü? Mağaza scripti bayi girişinde async
  // yüklenebileceği için mount'ta birkaç kez yoklarız.
  const [quoteApiAvailable, setQuoteApiAvailable] = useState(isQuoteApiReady);

  useEffect(() => {
    if (quoteApiAvailable) return undefined;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      if (isQuoteApiReady()) {
        setQuoteApiAvailable(true);
        clearInterval(interval);
      } else if (attempts >= 20) {
        // ~10s sonra vazgeç — kullanıcı muhtemelen bayi değil
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [quoteApiAvailable]);

  useEffect(() => {
    if (!cartSuccess) return undefined;
    const timer = setTimeout(() => resetCartFeedback(), 4000);
    return () => clearTimeout(timer);
  }, [cartSuccess, resetCartFeedback]);

  useEffect(() => {
    if (!quoteSuccess) return undefined;
    const timer = setTimeout(() => resetQuoteFeedback(), 4000);
    return () => clearTimeout(timer);
  }, [quoteSuccess, resetQuoteFeedback]);

  const disabled =
    cartLoading || updating || loading || !cartProperties || !variantId;

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleQuantityStep = (delta) => {
    setQuantity(Math.max(1, (parseInt(quantity, 10) || 1) + delta));
  };

  // "Add to Cart" / "Request a Quote" — sepete ekle, ardından tema cart drawer'ını aç.
  // Yönlendirme yapılmaz; FoxKit CartDrawer'ın beklediği `cart:refresh` event'i
  // `{ open: true }` detayıyla dispatch edilir — bu sayede drawer section içeriğini
  // yenileyip kendini görünür hale getirir.
  const handleAddToCart = async () => {
    if (disabled) return;
    const success = await addToCart("none");
    if (success) {
      document.dispatchEvent(
        new CustomEvent("cart:refresh", { bubbles: true, detail: { open: true } }),
      );
    }
  };

  // "Teklife Ekle" — ürünü mağazanın teklif listesine ekle (sepete EKLEMEZ).
  // Listeyi açma/yönlendirme yok; sağ-alt rozet sayacı otomatik güncellenir.
  const handleAddToQuote = async () => {
    if (disabled || quoteLoading) return;
    await addToQuoteList();
  };

  // "Add to Request" — fiyatsız Excel indir, cart'a ekleme yok
  const handleExportRequest = async () => {
    if (disabled || exporting) return;
    setExporting(true);
    try {
      await exportRequest();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="pcon-cart">
      <div className="pcon-cart__row">
        <label className="pcon-cart__qty-label" htmlFor="pcon-cart-qty">
          Quantity
        </label>
        <div className="pcon-cart__qty-control">
          <button
            type="button"
            className="pcon-cart__qty-step"
            onClick={() => handleQuantityStep(-1)}
            disabled={cartLoading || quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            id="pcon-cart-qty"
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={cartLoading}
            className="pcon-cart__qty-input"
          />
          <button
            type="button"
            className="pcon-cart__qty-step"
            onClick={() => handleQuantityStep(1)}
            disabled={cartLoading}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Dealer: iki buton yan yana */}
      {!isGuest ? (
        <div className="pcon-cart__btn-group">
          {/* <button
            type="button"
            className="pcon-cart__btn pcon-cart__btn--secondary"
            onClick={handleExportRequest}
            disabled={disabled || exporting}
            aria-busy={exporting}
          >
            {exporting ? (
              <>
                <span className="pcon-cart__btn-spinner" aria-hidden="true" />
                <span>Exporting...</span>
              </>
            ) : (
              "Export to Excel"
            )}
          </button> */}

          {quoteApiAvailable ? (
            <button
              type="button"
              className="pcon-cart__btn pcon-cart__btn--secondary"
              onClick={handleAddToQuote}
              disabled={disabled || quoteLoading}
              aria-busy={quoteLoading}
            >
              {quoteLoading ? (
                <>
                  <span className="pcon-cart__btn-spinner" aria-hidden="true" />
                  <span>Ekleniyor...</span>
                </>
              ) : (
                "Add to Quote List"
              )}
            </button>
          ) : null}

          <button
            type="button"
            className="pcon-cart__btn"
            onClick={handleAddToCart}
            disabled={disabled}
            aria-busy={cartLoading}
          >
            {cartLoading ? (
              <>
                <span className="pcon-cart__btn-spinner" aria-hidden="true" />
                <span>Adding...</span>
              </>
            ) : (
              addToCartLabel || "Add to Cart"
            )}
          </button>
        </div>
      ) : (
        /* Guest: tek "Request a Quote" butonu */
        <button
          type="button"
          className="pcon-cart__btn"
          onClick={handleAddToCart}
          disabled={disabled}
          aria-busy={cartLoading}
        >
          {cartLoading ? (
            <>
              <span className="pcon-cart__btn-spinner" aria-hidden="true" />
              <span>Adding...</span>
            </>
          ) : (
            "Request a Quote"
          )}
        </button>
      )}

      {cartError ? (
        <div className="pcon-cart__error" role="alert">
          {cartError}
        </div>
      ) : null}

      {cartSuccess ? (
        <div className="pcon-cart__success" role="status">
          Added to cart.
        </div>
      ) : null}

      {quoteError ? (
        <div className="pcon-cart__error" role="alert">
          {quoteError}
        </div>
      ) : null}

      {quoteSuccess ? (
        <div className="pcon-cart__success" role="status">
          Teklif listesine eklendi.
        </div>
      ) : null}
    </div>
  );
}

AddToCartButton.propTypes = {
  isGuest: PropTypes.bool,
};
