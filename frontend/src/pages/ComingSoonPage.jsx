import BlankTabPlaceholder from "../components/BlankTabPlaceholder";
import BottomNav from "../components/BottomNav";

// Everything on the bottom nav other than "Shop" is out of scope for this
// assignment - this keeps the nav consistent everywhere while making clear
// only Shop has real functionality.
export default function ComingSoonPage({ label }) {
  return (
    <div className="app-shell">
      <BlankTabPlaceholder label={label} />
      <BottomNav />
    </div>
  );
}