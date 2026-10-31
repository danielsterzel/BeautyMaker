
export function AuthBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 15% 80%, #e0dfe2 0%, transparent 55%),
            radial-gradient(ellipse at 85% 20%, #e9e6e7 0%, transparent 60%),
            linear-gradient(135deg, #faf9f8 0%, #eceaec 100%)
          `,
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M-200 950 C 100 250, 450 1100, 850 550 S 1300 350, 1650 100"
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />

        <path
          d="M-100 1100 C 250 500, 550 1200, 1050 650 S 1450 400, 1700 250"
          stroke="#ffffff"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
      </svg>
    </div>
  );
}
