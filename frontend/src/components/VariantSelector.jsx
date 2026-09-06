import Chip from "./shared/Chip";
import "../styles/components/VariantSelector.css";

export default function VariantSelector({ variantGroups, selectedVariants, onSelect }) {
  if (!variantGroups?.length) return null;

  return (
    <div className="variant-selector">
      {variantGroups.map((group) => (
        <div key={group.name} className="variant-selector__group">
          <p className="variant-selector__label">{group.name}</p>
          <div className="variant-selector__options">
            {group.options.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                look="outline"
                active={selectedVariants[group.name] === option.label}
                disabled={!option.inStock}
                suffix={!option.inStock ? " (Out of stock)" : null}
                onClick={() => onSelect(group.name, option.label)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
