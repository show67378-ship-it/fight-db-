export default function GymMap({ query }: { query: string }) {
  const q = encodeURIComponent(query);
  const embedSrc = `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <iframe
        src={embedSrc}
        title="ジムの地図"
        className="h-56 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-head block bg-surface px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
      >
        Googleマップで開く
      </a>
    </div>
  );
}
