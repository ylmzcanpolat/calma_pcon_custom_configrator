import useConfiguratorStore from "../store/configurator-store.js";

export default function PropertySelector() {
  const properties = useConfiguratorStore((s) => s.properties);
  const updateProperty = useConfiguratorStore((s) => s.updateProperty);

  const editableProps = properties.filter((p) => p.editable && p.options.length > 0);

  if (editableProps.length === 0) return null;

  return (
    <div className="pcon-properties">
      {editableProps.map((prop) => (
        <PropertyGroup
          key={prop.id}
          prop={prop}
          onSelect={(value) => updateProperty(prop.id, value)}
        />
      ))}
    </div>
  );
}

function PropertyGroup({ prop, onSelect }) {
  return (
    <div className="pcon-prop-group">
      <span className="pcon-prop-group__label">{prop.label}</span>
      <div className="pcon-prop-group__options">
        {prop.options.map((opt) => {
          const isActive = opt.value === prop.currentValue;
          const isColor = prop.type === "color" && opt.icon;

          const className = [
            "pcon-option-btn",
            isActive && "pcon-option-btn--active",
            !opt.available && "pcon-option-btn--disabled",
            isColor && "pcon-option-btn--color",
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
              onClick={() => onSelect(opt.value)}
            >
              {isColor ? (
                <img src={opt.icon} alt={opt.label} loading="lazy" />
              ) : (
                opt.label
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
