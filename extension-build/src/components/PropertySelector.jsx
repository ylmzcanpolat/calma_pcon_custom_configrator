import { useState } from "react";
import useConfiguratorStore from "../store/configurator-store.js";

export default function PropertySelector() {
  const properties = useConfiguratorStore((s) => s.properties);
  const updateProperty = useConfiguratorStore((s) => s.updateProperty);

  const editableProps = properties.filter((p) => p.editable && p.options.length > 0);

  if (editableProps.length === 0) return null;

  return (
    <div className="pcon-properties">
      {editableProps.map((prop) => (
        <PropertyCollapsible
          key={prop.id}
          prop={prop}
          onSelect={(value) => updateProperty(prop.id, value)}
        />
      ))}
    </div>
  );
}

function PropertyCollapsible({ prop, onSelect }) {
  const [open, setOpen] = useState(false);

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
        onClick={() => setOpen((prev) => !prev)}
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
    </div>
  );
}
