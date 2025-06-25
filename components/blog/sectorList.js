import Link from "next/link";
import Image from "next/image";

export default function SectorList({ sectors }) {
  return (
    <section id="sectors" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Sectors
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dive into specialized content across various fields and industries
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector) => (
            <Link
              key={sector._id}
              href={`/sector/${sector.slug.current || sector.slug}`}
              className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              aria-label={`View posts in ${sector.label}`}
            >
              <div className="overflow-hidden">
                <Image
                  src={sector.blockImageUrl || "/img/top.png"}
                  alt={sector.label}
                  width={600}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {sector.label}
                </h3>
                <p className="text-gray-600 mb-4">
                  {sector.description}
                </p>
                <div className="flex items-center text-blue-600 font-semibold">
                  <span>Explore Articles</span>
                  <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 