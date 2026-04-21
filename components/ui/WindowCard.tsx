import TrafficLights from "./TrafficLights";
import { cn } from "@/utils/lib";

const WindowCard = ({
  label,
  bodyClass = "window-body",
  className,
  titlebarLabelClassName,
  children,
  style = {},
}: {
  label: string;
  bodyClass?: string;
  className?: string;
  titlebarLabelClassName?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className={cn("window-card", className)} style={style}>
    <div className="window-titlebar">
      <TrafficLights />
      <span className={cn("titlebar-label", titlebarLabelClassName)}>{label}</span>
    </div>
    <div className={bodyClass}>{children}</div>
  </div>
);

export default WindowCard;
