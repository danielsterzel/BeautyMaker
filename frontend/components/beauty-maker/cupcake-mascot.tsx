type CupcakeMascotProps = {
  className?: string;
  frostingColor?: string;
  wrapperColor?: string;
  cheekColor?: string;
  label?: string;
  decorative?: boolean;
};

export function CupcakeMascot({
  className = "h-14 w-14",
  frostingColor = "#f7e8df",
  wrapperColor = "#d9a89a",
  cheekColor = "#e99aab",
  label = "BeautyMaker cupcake companion",
  decorative = false,
}: CupcakeMascotProps) {
  const accessibilityProps = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": label } as const);

  return (
    <svg
      viewBox="0 0 96 108"
      className={className}
      {...accessibilityProps}
    >
      <path
        d="M31 79 24 99M65 79l8 20M25 99l-7 2M71 99l7 2"
        fill="none"
        stroke="#614e4f"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M24 61 8 72M72 61l16 11M8 72l-4-1M88 72l4-1"
        fill="none"
        stroke="#614e4f"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M18 48h60l-8 39a9 9 0 0 1-9 7H35a9 9 0 0 1-9-7Z"
        fill={wrapperColor}
        stroke="#614e4f"
        strokeWidth="2.5"
      />
      <path
        d="m30 53 3 33M44 52l1 35M59 52l-2 35M70 52l-5 34"
        fill="none"
        opacity=".28"
        stroke="#70595b"
        strokeWidth="2"
      />
      <path
        d="M17 49c-2-8 3-14 10-16-1-11 8-19 18-15 6-10 23-5 22 7 10-1 17 9 12 18-1 3-4 5-8 6Z"
        fill={frostingColor}
        stroke="#614e4f"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <circle cx="38" cy="63" r="2.7" fill="#493b3c" />
      <circle cx="59" cy="63" r="2.7" fill="#493b3c" />
      <path
        d="M43 72c3 3 8 3 11 0"
        fill="none"
        stroke="#493b3c"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <circle cx="31" cy="70" r="4" fill={cheekColor} opacity=".48" />
      <circle cx="66" cy="70" r="4" fill={cheekColor} opacity=".48" />
    </svg>
  );
}
