import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 22, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);
export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
  </Svg>
);
export const CartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 4h2.5l2.2 11h10.6L20.5 7H7" />
    <circle cx="9.5" cy="19.5" r="1.5" />
    <circle cx="17" cy="19.5" r="1.5" />
  </Svg>
);
export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </Svg>
);
export const GridIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Svg>
);
export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);
export const CashIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
export const BoxIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m3 7 9-4 9 4v10l-9 4-9-4z" />
    <path d="m3 7 9 4 9-4M12 11v10" />
  </Svg>
);
export const GiftIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="9" width="18" height="12" rx="1.5" />
    <path d="M12 9v12M3 13h18M12 9c-2-4-7-3-5 0M12 9c2-4 7-3 5 0" />
  </Svg>
);
export const CheckIcon = (p: IconProps) => (
  <Svg strokeWidth={2.5} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
