import { cn } from "@/utils/lib";

const TrafficLights = ({ className }: { className?: string }) => (
  <div className={cn("flex gap-1", className)}>
    <div className="dot dot-r" />
    <div className="dot dot-y" />
    <div className="dot dot-g" />
  </div>
);

export default TrafficLights;
