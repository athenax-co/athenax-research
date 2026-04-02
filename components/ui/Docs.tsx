const DocSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-9">
    <h3 className="mb-3.5 border-b-2 border-b-ink pb-2.5 text-[22px]">{title}</h3>
    {children}
  </div>
);

const DocStep = ({ n, title, desc }: { n: number; title: string; desc: string }) => (
  <div className="mb-4 flex gap-4">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-yellow text-sm font-bold">{n}</div>
    <div>
      <div className="mb-1 font-semibold">{title}</div>
      <div className="text-sm leading-[1.6] text-muted">{desc}</div>
    </div>
  </div>
);

export { DocSection, DocStep };
