import { urlForImage } from "@/lib/sanity/image";
import { client } from "@/lib/sanity/client";
import PostList from "@/components/postlist";
import { notFound } from "next/navigation";
import localFont from 'next/font/local';
import Image from "next/image";
const interBold = localFont({
  src: '../../../../public/fonts/Inter-Bold.otf',
  variable: '--font-inter-bold',
});

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const character = await client.fetch(
    `*[_type == "character" && slug.current == $slug][0]`,
    { slug: params.slug }
  );

  if (!character) {
    return {
      title: 'Character Not Found | Lurnex Blog',
      description: 'The requested character could not be found.',
    };
  }

  return {
    title: `${character.label} Posts | Lurnex`,
    description: `Browse all posts in the ${character.label} character on Lurnex, the platform for innovative technology solutions and insights.`,
  };
}

export async function generateStaticParams() {
  const characters = await client.fetch(`*[_type == "character"]`);
  
  return characters.map((character) => ({
    slug: character.slug.current,
  }));
}

export default async function CharacterPage({ params }) {
  const character = await client.fetch(
    `*[_type == "character" && slug.current == $slug][0]{
      ...,
      "heroImageUrl": heroImage.asset->url,
      "iconUrl": icon.asset->url
    }`,
    { slug: params.slug }
  );

  if (!character) {
    notFound();
  }

  const posts = await client.fetch(
    `*[_type == "post" && character._ref == $characterId] | order(publishedAt desc) {
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
    { characterId: character._id }
  );

  const heroImageUrl = character.heroImageUrl;
  const iconUrl = character.iconUrl;

  return (
    <div className="bg-white min-h-screen">
    {/* Sector Hero Section */}
    <div className="relative w-full" style={{ minHeight: '320px' }}>
      {heroImageUrl ? (
        <>
          <Image
            src={heroImageUrl}
            alt={character.label}
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
        {character.icon?.asset && (
          <div className="mb-4 flex items-center justify-center" style={{ width: 64, height: 64 }}>
            <Image
              src={urlForImage(character.icon)?.src || "/img/top.png"}
              alt={character.label}
              width={64}
              height={64}
              className="rounded-full bg-white shadow-md border border-blue-200 object-contain"
              style={{ width: 64, height: 64 }}
            />
          </div>
        )}
          <h1 className={`text-4xl md:text-5xl font-bold text-white mb-2 ${interBold.variable}`}>{character.label}</h1>
          <p className="text-lg text-blue-100 mb-2 max-w-2xl mx-auto">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this character
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <section aria-label="Posts in this character" className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Fresh Blog Posts
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Stay updated with our latest insights and discoveries in the {character.label} character.
              </p>
            </div>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16 items-stretch">
              {posts.map((post) => (
                <PostList key={post._id} post={post} aspect="rectangle" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
