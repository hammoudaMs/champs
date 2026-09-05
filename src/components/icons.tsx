import type { SVGProps } from "react";
import type { Category } from "@/data/menu";

type IconProps = SVGProps<SVGSVGElement>;

function Svg(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    />
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.4 14.3 8l5.2.6-3.8 3.6.9 5.2L12 15.4 7.4 17.4l.9-5.2L4.5 8.6 9.7 8z" />
    </Svg>
  );
}

export function CupIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 8h10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z" />
      <path d="M16 9h2.2a2.2 2.2 0 0 1 0 4.4H16" />
      <path d="M8 4.5c.6.6.6 1.5 0 2M11 4.2c.6.6.6 1.6 0 2.2" />
    </Svg>
  );
}

export function IcedIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 6h8l-1 12H9L8 6z" />
      <path d="M10 10v4M14 10v4" />
      <path d="M12 3v3" />
    </Svg>
  );
}

export function FrappeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 8h8l-1.2 11H9.2L8 8z" />
      <path d="M8 8c0-2 8-2 8 0" />
      <path d="M12 8v11" />
    </Svg>
  );
}

export function TeaIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 10h9v5a3.5 3.5 0 0 1-3.5 3.5h-2A3.5 3.5 0 0 1 6 15v-5z" />
      <path d="M15 11h2a2 2 0 1 1 0 4h-2" />
      <path d="M9 5c.8 1 .8 2 0 3M12 4.5c.8 1 .8 2.2 0 3.2" />
    </Svg>
  );
}

export function ChocolateIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 9h10v6a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V9z" />
      <path d="M9 6.5c1 1 1 2 0 3M12 6c1 1 1 2.2 0 3.2M15 6.5c1 1 1 2 0 3" />
    </Svg>
  );
}

export function JuiceIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 7h8l-1 12H9L8 7z" />
      <path d="M10 4h4l1 3H9l1-3z" />
    </Svg>
  );
}

export function CocktailIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6h12L12 13 6 6z" />
      <path d="M12 13v6M9 19h6" />
      <path d="M16 4.5c.4.8.4 1.6 0 2.2" />
    </Svg>
  );
}

export function SmoothIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 8h8l-.8 11H8.8L8 8z" />
      <path d="M10 5.5 12 8l2-2.5" />
    </Svg>
  );
}

export function CrushIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 10h10v5a5 5 0 0 1-10 0v-5z" />
      <path d="M9 10V8a3 3 0 0 1 6 0v2" />
    </Svg>
  );
}

export function SmoothieIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 7h6l-1 12H10L9 7z" />
      <path d="M12 7V4M14.5 4.5 12 7" />
    </Svg>
  );
}

export function IceIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4c2 2.4 3.2 4.2 3.2 6.2A3.2 3.2 0 0 1 12 13.4 3.2 3.2 0 0 1 8.8 10.2C8.8 8.2 10 6.4 12 4z" />
      <path d="M9 14h6l-1 5H10l-1-5z" />
    </Svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="5" width="6" height="6" rx="1" />
      <rect x="13" y="5" width="6" height="6" rx="1" />
      <rect x="5" y="13" width="6" height="6" rx="1" />
      <rect x="13" y="13" width="6" height="6" rx="1" />
    </Svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 6h2l1.2 9h9.3l1.5-6H8" />
      <circle cx="10" cy="18.2" r="1.1" />
      <circle cx="16.2" cy="18.2" r="1.1" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 7v10M7 12h10" />
    </Svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 12h10" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 7l10 10M17 7 7 17" />
    </Svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 16c6-1 10-6 12-12-6 2-11 6-12 12z" />
      <path d="M7 14c2-2 5-4 9-5" />
    </Svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 4.6-7 9-7 9z" />
    </Svg>
  );
}

export function ChefIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 11h8v8H8z" />
      <path d="M8 11c-1.6-1-1.6-4 1-5 1-2 5-2 6 0 2.6 1 2.6 4 1 5" />
    </Svg>
  );
}

const CATEGORY_ICONS = {
  star: StarIcon,
  cup: CupIcon,
  iced: IcedIcon,
  frappe: FrappeIcon,
  tea: TeaIcon,
  chocolate: ChocolateIcon,
  juice: JuiceIcon,
  cocktail: CocktailIcon,
  smooth: SmoothIcon,
  crush: CrushIcon,
  smoothie: SmoothieIcon,
  ice: IceIcon,
} as const;

export function CategoryGlyph({
  icon,
  className,
}: {
  icon: Category["icon"];
  className?: string;
}) {
  const Icon = CATEGORY_ICONS[icon];
  return <Icon className={className} />;
}
