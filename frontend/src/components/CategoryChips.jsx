import Chip from "./shared/Chip";
import "../styles/components/CategoryChips.css";

export default function CategoryChips({ categories, active, onSelect }) {
  return (
    <div className="category-chips">
      <Chip label="All" active={!active} onClick={() => onSelect(null)} />
      {categories.map((category) => (
        <Chip
          key={category}
          label={category}
          active={active === category}
          onClick={() => onSelect(category)}
        />
      ))}
    </div>
  );
}
