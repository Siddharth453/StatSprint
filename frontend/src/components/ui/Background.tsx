export function Background() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-500/20 via-sky-500/15 to-violet-600/20 blur-[140px] rounded-full" />
      <div className="absolute top-1/4 -left-20 w-[350px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-fuchsia-500/15 blur-[130px] rounded-full" />
      {/* Subtle tactical grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
