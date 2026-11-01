import {
  Droplets,
  Heart,
  Search,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

type ClusterNodeProps = {
  icon: LucideIcon;
  label: string;
  className: string;
};

function ClusterNode({ icon: Icon, label, className }: ClusterNodeProps) {
  return (
    <div
      className={`
        absolute z-10 flex items-center justify-center
        gap-2 rounded-full border border-deep-champagne
        bg-white px-3 py-3
        shadow-[0_8px_24px_rgba(140,91,66,0.09)]
        backdrop-blur-md
        ${className}
      `}
    >
      <Icon className="h-4 w-4 shrink-0 text-[#9C654A]" strokeWidth={1.5} />
      <span className="text-[11px] font-medium text-charcoal whitespace-nowrap sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function ScientificCluster() {
  return (
    <div className="relative aspect-[1.85] w-full max-w-[650px]">

      <div
        className="pointer-events-none absolute inset-[15%] rounded-full
        bg-[#F3DDD0]/30 blur-[65px]"
      />


      <svg
        viewBox="0 0 640 340"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
      >
        <g stroke="#C9977E" strokeWidth="1.5" strokeOpacity="0.65">
          <path d="M240 80 C280 80 282 125 294 130" />
          <path d="M400 80 C360 80 358 125 346 130" />
          <path d="M240 260 C280 260 282 215 294 210" />
          <path d="M400 260 C360 260 358 215 346 210" />
        </g>
      </svg>


      <div
        className="absolute top-1/2 left-1/2 z-20
        flex aspect-square w-[21%] -translate-x-1/2
        -translate-y-1/2 items-center justify-center
        rounded-full border-3 border-white
        bg-[radial-gradient(circle,#F3DDD0_0%,#FAE9DF_65%,#FFF9F5_100%)]
        shadow-[0_10px_40px_rgba(201,127,104,0.18)]"
      >
        <span className="text-sm font-medium tracking-widest text-[#8B5B44] sm:text-lg">
          YOU
        </span>
      </div>


      <ClusterNode
        icon={Search}
        label="Skin concerns"
        className="left-[2%] top-[16%] w-[36%]"
      />

      <ClusterNode
        icon={Droplets}
        label="Skin type"
        className="right-[2%] top-[16%] w-[36%]"
      />

      <ClusterNode
        icon={FlaskConical}
        label="Current routine"
        className="left-[2%] bottom-[16%] w-[36%]"
      />

      <ClusterNode
        icon={Heart}
        label="Preferences"
        className="right-[2%] bottom-[16%] w-[36%]"
      />
    </div>
  );
}
