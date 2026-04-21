import Link from "next/link";
import { cn } from "@/utils/lib";

type BrandLogoProps = {
  badge?: string;
  href?: string;
  className?: string;
  wordmarkClassName?: string;
  badgeClassName?: string;
  ariaLabel?: string;
};

const BrandLogo = ({ badge, href = "/", className, wordmarkClassName, badgeClassName, ariaLabel = "Go to AthenaX home" }: BrandLogoProps) => {
  return (
    <Link className={cn("flex items-center gap-2.5 font-bold text-[18px] text-ink no-underline", className)} href={href} aria-label={ariaLabel}>
      <div className="size-8 bg-gray-900 rounded text-white flex items-center justify-center text-lg shadow-sm p-1">
        <img src="https://athenax.mypinx.store/Logo_Icon_White.png" alt="AthenaX Logo" width={200} height={100} className="size-7 object-contain" />
      </div>
      <span
        className={cn("leading-none tracking-[-0.02em] text-ink text-[32px]", wordmarkClassName)}
        style={{ fontFamily: "var(--font-londrina), cursive" }}
      >
        AthenaX
      </span>
      {badge ? (
        <span
          className={cn(
            "text-[9px] font-mono font-semibold tracking-wider uppercase text-white bg-gray-900 rounded px-1 py-0.5 self-start",
            badgeClassName
          )}
        >
          [{badge}]
        </span>
      ) : null}
    </Link>
  );
};

export default BrandLogo;
