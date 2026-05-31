import Image from "next/image";
import Link from "next/link";

type LogoSize = "sm" | "md" | "lg";

const heightBySize: Record<LogoSize, number> = {
  sm: 32,
  md: 40,
  lg: 52,
};

interface LogoImageProps {
  size?: LogoSize;
  className?: string;
  priority?: boolean;
}

export function LogoImage({
  size = "md",
  className = "",
  priority = false,
}: LogoImageProps) {
  const height = heightBySize[size];
  return (
    <Image
      src="/logo.png"
      alt="StayNEP — Hospitality, elevated by AI"
      width={545}
      height={609}
      priority={priority}
      className={`w-auto object-contain object-left ${className}`}
      style={{ height }}
    />
  );
}

interface LogoProps extends LogoImageProps {
  href?: string;
}

export default function Logo({
  href = "/",
  size = "md",
  className = "",
  priority = false,
}: LogoProps) {
  const image = (
    <LogoImage size={size} className={className} priority={priority} />
  );

  if (!href) {
    return <span className="inline-flex shrink-0 items-center">{image}</span>;
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-obsidian/50"
    >
      {image}
    </Link>
  );
}
