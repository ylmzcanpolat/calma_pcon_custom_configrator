import { useState } from "react";
import useConfiguratorStore from "../store/configurator-store.js";

/**
 * Nested property relationships.
 * Key   = child prop ID  (rendered inside parent's collapsible body)
 * Value = parent prop ID (hosts the child)
 *
 * When a parent's value changes the store already fetches fresh `properties`
 * from the backend, so the child's options update automatically — no extra
 * logic is required here.
 */
const NESTED_PROP_CHILD_OF = {
  "DUVAR.DOSEME_RENK_DUVAR": "DUVAR.DOSEME_SERI_DUVAR",
};

/**
 * Explicit display order for known property IDs.
 * Properties whose ID is not listed here are appended after these, preserving
 * the order they arrive from the backend.
 */
const PROP_ORDER = [
  "DUVAR.DOSEME_SERI_DUVAR",
  "DUVAR.KECE_RENK_DUVAR",
  "DUVAR.YUZEY_RENK_DUVAR",
  "ZEMIN.HALI_RENK",
  "MASA.MASA_TUR",
  "MASA.YUZEY_RENK_MASA",
  "GENEL.BOLGE",
  "GENEL.PRIZ_TIPI",
  "TAVAN.SPRINKLER",
  "MT_TEXT.GGRACHAIR",
];

const PROP_ORDER_INDEX = new Map(PROP_ORDER.map((id, i) => [id, i]));

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

  // IDs of props that must be rendered nested — excluded from top-level list.
  const childPropIds = new Set(Object.keys(NESTED_PROP_CHILD_OF));

  // Top-level props: everything that is NOT a designated nested child,
  // sorted by PROP_ORDER. Unknown IDs retain their original backend order
  // and appear after all known IDs.
  const topLevelProps = editableProps
    .filter((p) => !childPropIds.has(p.id))
    .map((prop, backendIdx) => ({ prop, backendIdx }))
    .sort((a, b) => {
      const ai = PROP_ORDER_INDEX.has(a.prop.id)
        ? PROP_ORDER_INDEX.get(a.prop.id)
        : PROP_ORDER.length + a.backendIdx;
      const bi = PROP_ORDER_INDEX.has(b.prop.id)
        ? PROP_ORDER_INDEX.get(b.prop.id)
        : PROP_ORDER.length + b.backendIdx;
      return ai - bi;
    })
    .map(({ prop }) => prop);

  // Build parentId → [child prop, …] lookup using live (store-fresh) prop objects
  // so option lists stay up-to-date after every backend response.
  const childrenByParent = {};
  for (const [childId, parentId] of Object.entries(NESTED_PROP_CHILD_OF)) {
    const childProp = editableProps.find((p) => p.id === childId);
    if (childProp) {
      if (!childrenByParent[parentId]) childrenByParent[parentId] = [];
      childrenByParent[parentId].push(childProp);
    }
  }

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="pcon-properties">
      {topLevelProps.map((prop) => (
        <PropertyCollapsible
          key={prop.id}
          prop={prop}
          open={openId === prop.id}
          onToggle={() => handleToggle(prop.id)}
          onSelect={(value) => updateProperty(prop.id, value)}
          onPrefetch={(value) => prefetchProperty(prop.id, value)}
          childProps={childrenByParent[prop.id] || []}
          updateProperty={updateProperty}
          prefetchProperty={prefetchProperty}
        />
      ))}
    </div>
  );
}

function PropertyCollapsible({
  prop,
  open,
  onToggle,
  onSelect,
  onPrefetch,
  childProps = [],
  updateProperty,
  prefetchProperty,
}) {
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

      {open && childProps.length > 0 && (
        <div className="pcon-prop-group__nested">
          {childProps.map((childProp) => (
            <PropertyInlineSection
              key={childProp.id}
              prop={childProp}
              onSelect={(value) => updateProperty(childProp.id, value)}
              onPrefetch={(value) => prefetchProperty(childProp.id, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Inline (non-collapsible) section for a nested child property.
 *
 * Renders inside the parent property's open body without its own toggle,
 * border, or card wrapper. Shows:
 *   - property label  (pcon-prop-group__label)
 *   - currently selected option: swatch + label  (pcon-prop-group__summary-*)
 *   - all options as interactive buttons (same chip/swatch pattern as the
 *     parent), so the user can select a value directly
 */
function PropertyInlineSection({ prop, onSelect, onPrefetch }) {
  const isColor = prop.type === "color";
  const currentOption = prop.options.find((o) => o.value === prop.currentValue);

  const handleSelect = (opt) => {
    if (!opt.available) return;
    if (opt.value !== prop.currentValue) {
      onSelect(opt.value);
    }
  };

  const handleHover = (opt) => {
    if (!onPrefetch) return;
    if (!opt.available) return;
    if (opt.value === prop.currentValue) return;
    onPrefetch(opt.value);
  };

  const bodyClassName = isColor
    ? "pcon-prop-group__body pcon-prop-group__body--colors"
    : "pcon-prop-group__body pcon-prop-group__body--chips";

  return (
    <div className="pcon-prop-inline">
      <div className="pcon-prop-inline__header">
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
      </div>

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
    </div>
  );
}
