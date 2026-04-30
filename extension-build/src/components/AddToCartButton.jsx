import { useEffect } from "react";
import useConfiguratorStore from "../store/configurator-store.js";

export default function AddToCartButton() {
  const quantity = useConfiguratorStore((s) => s.quantity);
  const setQuantity = useConfiguratorStore((s) => s.setQuantity);
  const addToCart = useConfiguratorStore((s) => s.addToCart);
  const resetCartFeedback = useConfiguratorStore((s) => s.resetCartFeedback);
  const cartLoading = useConfiguratorStore((s) => s.cartLoading);
  const cartError = useConfiguratorStore((s) => s.cartError);
  const cartSuccess = useConfiguratorStore((s) => s.cartSuccess);
  const cartProperties = useConfiguratorStore((s) => s.cartProperties);
  const variantId = useConfiguratorStore((s) => s.variantId);
  const updating = useConfiguratorStore((s) => s.updating);
  const loading = useConfiguratorStore((s) => s.loading);
  const addToCartLabel = useConfiguratorStore((s) => s.addToCartLabel);

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

  const handleClick = () => {
    if (disabled) return;
    addToCart();
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

      <button
        type="button"
        className="pcon-cart__btn"
        onClick={handleClick}
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
