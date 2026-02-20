export function Logo({
  size = 28,
  showText = true,
}: {
  size?: number;
  showText?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.35 }}>
      {/* Golf hole / ring mark */}
      <svg
        width={size}
        height={Math.round(size * 1.18)}
        viewBox="0 0 40 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="18" r="13" stroke="#1C5C3A" strokeWidth="5.5" />
        <circle cx="20" cy="39" r="3.8" fill="#1C5C3A" />
      </svg>

      {showText && (
        <span
          style={{
            fontSize: size * 0.82,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#1C5C3A" }}>outing</span>
          <span style={{ color: "#888888" }}>.golf</span>
        </span>
      )}
    </div>
  );
}
