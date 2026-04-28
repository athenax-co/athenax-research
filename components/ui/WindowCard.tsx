import TrafficLights from "./TrafficLights";
import { cn } from "@/utils/lib";

const WindowCard = ({
  label,
  bodyClass = "window-body",
  className,
  titlebarLabelClassName,
  titleRight,
  children,
  style = {},
}: {
  label: string;
  bodyClass?: string;
  className?: string;
  titlebarLabelClassName?: string;
  titleRight?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className={cn("window-card", className)} style={style}>
    <div className="window-titlebar">
      <TrafficLights />
      <span className={cn("titlebar-label", titlebarLabelClassName)}>{label}</span>
      {titleRight && <span className="ml-auto font-['Space_Mono',monospace] text-[10px] text-[#888]">{titleRight}</span>}
    </div>
    <div className={bodyClass}>{children}</div>
  </div>
);

export default WindowCard;
