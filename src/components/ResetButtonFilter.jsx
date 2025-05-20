export default function ResetButtonFilter({ onClick, ariaLabel }) {
  return (
    <button
      className="btn btn-warning btn-sm ms-2"
      style={{ width: "40px", flexShrink: 0, height: "35px" }}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <i className="fa-solid fa-rotate-left"></i>
    </button>
  );
}
