import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useConfiguratorStore from "../store/configurator-store.js";

const REDIRECT_AFTER_CART = "/collections/calma-pods";

/**
 * @param {{ isGuest?: boolean }} props
 *   isGuest=false (dealer): "Add to Request" + "Add to Cart" iki buton gösterilir.
 *     - "Add to Request": fiyatsız Excel indirir, sepete ekleme yapmaz.
 *     - "Add to Cart": sepete ekler ve REDIRECT_AFTER_CART'a yönlendirir.
 *   isGuest=true (guest): tek "Request a Quote" butonu — sepete ekler + yönlendirir.
 */
export default function AddToCartButton({ isGuest = false }) {
  const quantity = useConfiguratorStore((s) => s.quantity);
  const setQuantity = useConfiguratorStore((s) => s.setQuantity);
  const addToCart = useConfiguratorStore((s) => s.addToCart);
  const exportRequest = useConfiguratorStore((s) => s.exportRequest);
  const resetCartFeedback = useConfiguratorStore((s) => s.resetCartFeedback);
  const cartLoading = useConfiguratorStore((s) => s.cartLoading);
  const cartError = useConfiguratorStore((s) => s.cartError);
  const cartSuccess = useConfiguratorStore((s) => s.cartSuccess);
  const cartProperties = useConfiguratorStore((s) => s.cartProperties);
  const variantId = useConfiguratorStore((s) => s.variantId);
  const updating = useConfiguratorStore((s) => s.updating);
  const loading = useConfiguratorStore((s) => s.loading);
  const addToCartLabel = useConfiguratorStore((s) => s.addToCartLabel);

  // "Add to Request" için yerel loading state (Excel oluşturma sırasında)
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!cartSuccess) return undefined;
    const timer = setTimeout(() => resetCartFeedback(), 4000);
    return () => clearTimeout(timer);
  }, [cartSuccess, resetCartFeedback]);

  const disabled =
    cartLoading || updating || loading || !cartProperties || !variantId;

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleQuantityStep = (delta) => {
    setQuantity(Math.max(1, (parseInt(quantity, 10) || 1) + delta));
  };

  // "Add to Cart" / "Request a Quote" — sepete ekle + yönlendir
  const handleAddToCart = async () => {
    if (disabled) return;
    const success = await addToCart("none");
    if (success) {
      const routesRoot = (window.Shopify?.routes?.root || "/").replace(/\/$/, "");
      window.location.href = routesRoot + REDIRECT_AFTER_CART;
    }
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
          <button
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
          </button>

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
    </div>
  );
}

AddToCartButton.propTypes = {
  isGuest: PropTypes.bool,
};
