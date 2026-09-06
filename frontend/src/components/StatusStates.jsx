import "../styles/components/StatusStates.css";

/**
 * Shared skeleton behind Loading/Error/Empty states: an icon (or
 * spinner), a line of text, and an optional action button. The three
 * exports below are just this skeleton called with different values,
 * so a fourth "state" only ever needs a new one-line wrapper here.
 */
function StatusState({ icon, spinner, text, actionLabel, onAction }) {
  return (
    <div className="status-state">
      {spinner ? (
        <div className="status-state__spinner" />
      ) : (
        <p className="status-state__icon">{icon}</p>
      )}
      <p className="status-state__text">{text}</p>
      {onAction && (
        <button type="button" className="status-state__retry" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return <StatusState spinner text={label} />;
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <StatusState icon="⚠️" text={message} onAction={onRetry} actionLabel="Try again" />
  );
}

export function EmptyState({ message = "Nothing to show here yet." }) {
  return <StatusState icon="🛍️" text={message} />;
}
