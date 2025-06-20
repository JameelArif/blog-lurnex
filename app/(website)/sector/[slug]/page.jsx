import { urlForImage } from "@/lib/sanity/image";
import { client } from "@/lib/sanity/client";
import PostList from "@/components/postlist";
import { notFound } from "next/navigation";
import localFont from 'next/font/local';

const interBold = localFont({
  src: '../../../../public/fonts/Inter-Bold.otf',
  variable: '--font-inter-bold',
});

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const sector = await client.fetch(
    `*[_type == "sector" && slug.current == $slug][0]`,
    { slug: params.slug }
  );

  if (!sector) {
    return {
      title: 'Sector Not Found | Lurnex Blog',
      description: 'The requested sector could not be found.',
    };
  }

  return {
    title: `${sector.label} Posts | Lurnex`,
    description: `Browse all posts in the ${sector.label} sector on Lurnex, the platform for innovative technology solutions and insights.`,
  };
}

export async function generateStaticParams() {
  const sectors = await client.fetch(`*[_type == "sector"]`);
  
  return sectors.map((sector) => ({
    slug: sector.slug.current,
  }));
}

export default async function SectorPage({ params }) {
  const sector = await client.fetch(
    `*[_type == "sector" && slug.current == $slug][0]`,
    { slug: params.slug }
  );

  if (!sector) {
    notFound();
  }

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

  return (
    <div className="bg-white">
      {/* Sector Hero Section */}
      <div className="relative bg-lurnex-blue py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${interBold.variable}`}>
              {sector.label}
            </h1>
            <p className="text-lg text-blue-100">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this sector
            </p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
              {posts.map((post) => (
                <PostList key={post._id} post={post} aspect="rectangle" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
