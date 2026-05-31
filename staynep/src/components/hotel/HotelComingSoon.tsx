interface HotelComingSoonProps {
  title: string;
  description?: string;
}

export default function HotelComingSoon({
  title,
  description = "This module is coming soon. Manage rooms and bookings from the Operations section today.",
}: HotelComingSoonProps) {
  return (
    <div className="rounded-[16px] border border-fog bg-snow p-10 text-center shadow-sm">
      <h1 className="text-xl font-bold text-obsidian font-cosmica">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-steel">{description}</p>
    </div>
  );
}
