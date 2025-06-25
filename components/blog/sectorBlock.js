import Link from "next/link";
import Image from "next/image";

export default function SectorBlock({ sector }) {
  // Prefer blockImage, fallback to icon
  const imageUrl = sector.blockImageUrl || sector.iconUrl;
  return (
    <Link
      href={`/sector/${sector.slug.current || sector.slug}`}
      className="group relative flex flex-col justify-end w-full max-w-xs h-40 md:h-48 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white hover:shadow-2xl hover:border-blue-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label={`View posts in ${sector.label}`}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={sector.label}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
      {/* Title and description */}
      <div className="relative z-20 p-4 flex flex-col items-start">
        <span className="text-lg md:text-xl font-bold text-white drop-shadow-lg mb-1">
          {sector.label}
        </span>
        {sector.description && (
          <span className="text-xs md:text-sm text-white/80 line-clamp-2">
            {sector.description}
          </span>
        )}
      </div>
    </Link>
  );
} 