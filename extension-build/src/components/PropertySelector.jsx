import { useState } from "react";
import useConfiguratorStore from "../store/configurator-store.js";

export default function PropertySelector() {
  const properties = useConfiguratorStore((s) => s.properties);
  const updateProperty = useConfiguratorStore((s) => s.updateProperty);
  // Faz 6 — Hover/focus prefetch. Action store içinde flag-gated
  // (PCON_HOVER_PREFETCH default OFF) → flag kapalıyken no-op döner;
  // component flag bilmek zorunda değil.
  const prefetchProperty = useConfiguratorStore((s) => s.prefetchProperty);

  // Accordion davranışı — aynı anda en fazla bir grup açık. `null` hepsi kapalı.
  // Açık olan gruba tekrar tıklanırsa kapanır; başka bir gruba tıklanırsa
  // eskisi otomatik kapanır (handleToggle tek state geçişiyle hallediyor).
  const [openId, setOpenId] = useState(null);

  const editableProps = properties.filter((p) => p.editable && p.options.length > 0);

  if (editableProps.length === 0) return null;

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="pcon-properties">
      {editableProps.map((prop) => (
        <PropertyCollapsible
          key={prop.id}
          prop={prop}
          open={openId === prop.id}
          onToggle={() => handleToggle(prop.id)}
          onSelect={(value) => updateProperty(prop.id, value)}
          onPrefetch={(value) => prefetchProperty(prop.id, value)}
        />
      ))}
    </div>
  );
}

function PropertyCollapsible({ prop, open, onToggle, onSelect, onPrefetch }) {

  const isColor = prop.type === "color";
  const currentOption = prop.options.find((o) => o.value === prop.currentValue);

  const handleSelect = (opt) => {
    if (!opt.available) return;
    if (opt.value !== prop.currentValue) {
      onSelect(opt.value);
    }
  };

  // Faz 6 — Hover/focus prefetch tetikleyici. Disabled veya zaten seçili
  // option için ilgisiz çağrı; store action zaten guard ediyor ama burada
  // da erken dönüş ile gereksiz function call'u eliyoruz (klavye kullanıcısı
  // her option'a focus geçirebilir → çok sık tetiklenir).
  const handleHover = (opt) => {
    if (!onPrefetch) return;
    if (!opt.available) return;
    if (opt.value === prop.currentValue) return;
    onPrefetch(opt.value);
  };

  const groupClassName = [
    "pcon-prop-group",
    open && "pcon-prop-group--open",
  ]
    .filter(Boolean)
    .join(" ");

  const bodyClassName = isColor
    ? "pcon-prop-group__body pcon-prop-group__body--colors"
    : "pcon-prop-group__body pcon-prop-group__body--chips";

  return (
    <div className={groupClassName}>
      <button
        type="button"
        className="pcon-prop-group__header"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="pcon-prop-group__header-main">
          <span className="pcon-prop-group__label">{prop.label}</span>
          <span className="pcon-prop-group__summary">
            {isColor && currentOption?.icon ? (
              <span
                className="pcon-prop-group__summary-swatch"
                style={{ backgroundImage: `url("${currentOption.icon}")` }}
                aria-hidden="true"
              />
            ) : null}
            <span className="pcon-prop-group__summary-label">
              {currentOption?.label ?? "—"}
            </span>
          </span>
        </span>
        <span className="pcon-prop-group__toggle" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className={bodyClassName}>
          {prop.options.map((opt) => {
            const isActive = opt.value === prop.currentValue;

            if (isColor) {
              const className = [
                "pcon-option-swatch",
                isActive && "pcon-option-swatch--active",
                !opt.available && "pcon-option-swatch--disabled",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  type="button"
                  key={opt.value}
                  className={className}
                  disabled={!opt.available}
                  title={opt.label}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => handleHover(opt)}
                  onFocus={() => handleHover(opt)}
                >
                  <span
                    className="pcon-option-swatch__thumb"
                    style={
                      opt.icon
                        ? { backgroundImage: `url("${opt.icon}")` }
                        : undefined
                    }
                    aria-hidden="true"
                  />
                  <span className="pcon-option-swatch__label">{opt.label}</span>
                </button>
              );
            }

            const className = [
              "pcon-option-chip",
              isActive && "pcon-option-chip--active",
              !opt.available && "pcon-option-chip--disabled",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                type="button"
                key={opt.value}
                className={className}
                disabled={!opt.available}
                title={opt.label}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => handleHover(opt)}
                onFocus={() => handleHover(opt)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
