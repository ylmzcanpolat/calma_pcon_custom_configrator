import { useState } from "react";
import useConfiguratorStore from "../store/configurator-store.js";

/**
 * Nested property relationships.
 * Key   = child prop ID  (parent'ın collapsible body'si içinde render edilir)
 * Value = parent prop ID (child'ı barındırır)
 *
 * WCF setValue() sonrası store fresh properties döndürdüğünden child
 * options (SERI değişince RENK seçenekleri) otomatik güncellenir — ekstra logic gerekmez.
 */
const NESTED_PROP_CHILD_OF = {
  "[Character]NRUS_DOSEME_RENK_DUVAR": "[Character]NRUS_DOSEME_SERI_DUVAR",
};

// Sıralama store'daki PROPERTY_ORDER tarafından mapWcfProperties aşamasında
// yapılır; properties dizisi store'dan zaten doğru sırayla gelir.
// PropertySelector burada ek sıralama yapmaz, store sırasını korur.

export default function PropertySelector() {
  const properties = useConfiguratorStore((s) => s.properties);
  const updateProperty = useConfiguratorStore((s) => s.updateProperty);

  // Accordion davranışı — aynı anda en fazla bir grup açık.
  const [openId, setOpenId] = useState(null);

  const editableProps = properties.filter((p) => p.editable && p.options.length > 0);

  if (editableProps.length === 0) return null;

  const childPropIds = new Set(Object.keys(NESTED_PROP_CHILD_OF));

  // Sıralama store'dan (mapWcfProperties → PROPERTY_ORDER) geldiği için
  // burada ek sort uygulanmıyor; store sırası korunuyor.
  const topLevelProps = editableProps.filter((p) => !childPropIds.has(p.id));

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
          childProps={childrenByParent[prop.id] || []}
          updateProperty={updateProperty}
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
  childProps = [],
  updateProperty,
}) {
  const isColor = prop.type === "color";
  const currentOption = prop.options.find((o) => o.value === prop.currentValue);

  const handleSelect = (opt) => {
    if (!opt.available) return;
    if (opt.value !== prop.currentValue) {
      onSelect(opt.value);
    }
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
 * border, or card wrapper.
 */
function PropertyInlineSection({ prop, onSelect }) {
  const isColor = prop.type === "color";
  const currentOption = prop.options.find((o) => o.value === prop.currentValue);

  const handleSelect = (opt) => {
    if (!opt.available) return;
    if (opt.value !== prop.currentValue) {
      onSelect(opt.value);
    }
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
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
