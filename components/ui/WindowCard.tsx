import TrafficLights from "./TrafficLights";

const WindowCard = ({
  label,
  bodyClass = "window-body",
  children,
  style = {},
}: {
  label: string;
  bodyClass?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className="window-card" style={style}>
    <div className="window-titlebar">
      <TrafficLights />
      <span className="titlebar-label">{label}</span>
    </div>
    <div className={bodyClass}>{children}</div>
  </div>
);

export default WindowCard;
