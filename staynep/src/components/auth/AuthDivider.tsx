export default function AuthDivider() {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-fog" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-snow px-3 text-xs font-medium uppercase tracking-wider text-steel font-cosmica">
          or
        </span>
      </div>
    </div>
  );
}
