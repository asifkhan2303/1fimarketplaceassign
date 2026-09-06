import "../../styles/shared/Chip.css";

/**
 * Generic selectable pill/chip button.
 *
 * ShopTabs, CategoryChips, and VariantSelector were each re-implementing
 * the same "row of toggleable buttons with an active state" markup with
 * only cosmetic differences. This is the single skeleton all three now
 * render through - only the data and the `look` differ per call site.
 *
 * `look` controls the visual treatment only, since each context needs a
 * different active style:
 *   - "tab"     white pill floating on a tinted track   (ShopTabs)
 *   - "filled"  solid primary background when active    (CategoryChips)
 *   - "outline" tinted background + border when active   (VariantSelector)
 */
export default function Chip({ label, active = false, disabled = false, onClick, look = "filled", suffix }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`chip chip--${look} ${active ? "chip--active" : ""}`}
    >
      {label}
      {suffix && <span className="chip__suffix">{suffix}</span>}
    </button>
  );
}
