import { urlForImage } from "@/lib/sanity/image";
import { client, getSettings } from "@/lib/sanity/client";
import PostList from "@/components/postlist";
import { notFound } from "next/navigation";
import localFont from 'next/font/local';
import Image from "next/image";

const interBold = localFont({
  src: '../../../../public/fonts/Inter-Bold.otf',
  variable: '--font-inter-bold',
});

export const revalidate = 60;

type Params = { slug: string };
type SearchParams = { page?: string };

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = params;
  const settings = await getSettings();
  const sector = await client.fetch(
    `*[_type == "sector" && slug.current == $slug][0]`,
    { slug }
  );

  if (!sector) {
    return {
      title: 'Sector Not Found',
      description: 'The requested sector could not be found.',
    };
  }

  const { label, description, seo } = sector;
  const seoTitle = seo?.title || label;
  const seoDesc = seo?.description || description;
  const seoImageSrc = seo?.image ? urlForImage(seo.image)?.src : urlForImage(settings.openGraphImage)?.src;

  return {
    title: seoTitle,
    description: seoDesc,
    canonical: `${settings.url}/sector/${slug}`,
    openGraph: {
      url: `${settings.url}/sector/${slug}`,
      title: seoTitle,
      description: seoDesc,
      images: [
        {
          url: seoImageSrc || '/img/opengraph.jpg',
          width: 800,
          height: 600,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: [seoImageSrc || '/img/opengraph.jpg'],
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    }
  };
}

export async function generateStaticParams() {
  const sectors = await client.fetch(`*[_type == "sector"]`);
  return sectors.map((sector: any) => ({
    slug: sector.slug.current,
  }));
}

export default async function SectorPage({ params, searchParams }: { params: Params, searchParams?: SearchParams }) {
  const sector = await client.fetch(
    `*[_type == "sector" && slug.current == $slug][0]{
      ...,
      "heroImageUrl": heroImage.asset->url
    }`,
    { slug: params.slug }
  );

  if (!sector) {
    notFound();
  }

  // Pagination logic
  const pageSize = 9;
  const page = parseInt(searchParams?.page || "1", 10);
  const posts = await client.fetch(
    `*[_type == "post" && sector._ref == $sectorId] | order(publishedAt desc) {
      _id,
      title,
      mainImage,
      publishedAt,
      slug,
      excerpt,
      author->{
        _id,
        name,
        image,
        slug
      },
      categories[]->{
        title,
        slug
      },
      "sector": sector->{label, "slug": slug.current, "iconUrl": icon.asset->url},
      "character": character->{label, "slug": slug.current, "iconUrl": icon.asset->url},
      "topic": topic->{label, "slug": slug.current, "iconUrl": icon.asset->url}
    }`,
    { sectorId: sector._id }
  );
  const paginatedPosts = posts.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(posts.length / pageSize);

  // Fetch hero image URL if available
  const heroImageUrl = sector.heroImageUrl;

  return (
    <div className="bg-white min-h-screen">
      {/* Sector Hero Section */}
      <div className="relative w-full" style={{ minHeight: '320px' }}>
        {heroImageUrl ? (
          <>
            <Image
              src={heroImageUrl}
              alt={sector.label}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-lurnex-blue z-0" style={{ minHeight: '320px' }} />
        )}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24" style={{ minHeight: '320px' }}>
          {sector.icon?.asset && (
            <div className="mb-4 flex items-center justify-center" style={{ width: 64, height: 64 }}>
              <Image
                src={urlForImage(sector.icon)?.src || "/img/top.png"}
                alt={sector.label}
                width={64}
                height={64}
                className="rounded-full bg-white shadow-md border border-blue-200 object-contain"
              />
            </div>
          )}
          <h1 className={`text-4xl md:text-5xl font-bold text-white mb-2 ${interBold.variable}`}>{sector.label}</h1>
          {sector.description && (
            <p className="text-lg text-blue-100 mb-2 max-w-2xl mx-auto">{sector.description}</p>
          )}
          <p className="text-base text-blue-100 mb-2">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this sector
          </p>
        </div>
      </div>

      {/* Posts Grid Section */}
      <section aria-label="Posts in this sector" className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Fresh Blog Posts
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Stay updated with our latest insights and discoveries in the {sector.label} sector.
              </p>
            </div>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
              {paginatedPosts.map((post: any) => (
                <PostList
                  key={post._id}
                  post={post}
                  aspect="rectangle"
                  minimal={false}
                  pathPrefix={""}
                  preloadImage={false}
                  fontSize={undefined}
                  fontWeight={undefined}
                />
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <a
                    key={idx}
                    href={`?page=${idx + 1}`}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-150 ${
                      page === idx + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                    }`}
                    aria-current={page === idx + 1 ? "page" : undefined}
                  >
                    {idx + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
} 