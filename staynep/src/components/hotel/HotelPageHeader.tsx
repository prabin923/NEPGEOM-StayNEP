interface HotelPageHeaderProps {
  title: string;
  description: string;
}

export default function HotelPageHeader({ title, description }: HotelPageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-obsidian font-cosmica">{title}</h1>
      <p className="mt-1 text-sm text-steel">{description}</p>
    </div>
  );
}
