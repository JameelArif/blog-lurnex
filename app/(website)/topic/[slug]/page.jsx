import { urlForImage } from "@/lib/sanity/image";
import { client, getSettings } from "@/lib/sanity/client";
import PostList from "@/components/postlist";
import { notFound } from "next/navigation";
import localFont from 'next/font/local';

const interBold = localFont({
  src: '../../../../public/fonts/Inter-Bold.otf',
  variable: '--font-inter-bold',
});

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = params;
  const settings = await getSettings();
  const topic = await client.fetch(
    `*[_type == "topic" && slug.current == $slug][0]`,
    { slug }
  );

  if (!topic) {
    return {
      title: 'Topic Not Found',
      description: 'The requested topic could not be found.',
    };
  }

  const { label, seo } = topic;
  const seoTitle = seo?.title || label;
  const seoDesc = seo?.description || `Browse posts in the ${label} topic.`;
  const seoImageSrc = seo?.image ? urlForImage(seo.image)?.src : urlForImage(settings.openGraphImage)?.src;

  return {
    title: seoTitle,
    description: seoDesc,
    canonical: `${settings.url}/topic/${slug}`,
    openGraph: {
      url: `${settings.url}/topic/${slug}`,
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
  const topics = await client.fetch(`*[_type == "topic"]`);
  
  return topics.map((topic) => ({
    slug: topic.slug.current,
  }));
}

export default async function TopicPage({ params }) {
  const topic = await client.fetch(
    `*[_type == "topic" && slug.current == $slug][0]{
      ...,
      "heroImageUrl": heroImage.asset->url,
      "iconUrl": icon.asset->url
    }`,
    { slug: params.slug }
  );

  if (!topic) {
    notFound();
  }

  const posts = await client.fetch(
    `*[_type == "post" && topic._ref == $topicId] | order(publishedAt desc) {
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
    { topicId: topic._id }
  );

  const heroImageUrl = topic.heroImageUrl;
  const iconUrl = topic.iconUrl;

  return (
    <div className="bg-white min-h-screen">
      {/* Topic Hero Section */}
      <div className="relative w-full" style={{ minHeight: '320px' }}>
        {heroImageUrl ? (
          <>
            <img
              src={heroImageUrl}
              alt={topic.label}
              className="object-cover object-center w-full h-full absolute inset-0"
              style={{ minHeight: '320px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-lurnex-blue z-0" style={{ minHeight: '320px' }} />
        )}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24" style={{ minHeight: '320px' }}>
          {iconUrl && (
            <div className="mb-4 flex items-center justify-center" style={{ width: 64, height: 64 }}>
              <img
                src={iconUrl}
                alt={topic.label}
                width={64}
                height={64}
                className="rounded-full bg-white shadow-md border border-blue-200 object-contain"
                style={{ width: 64, height: 64 }}
              />
            </div>
          )}
          <h1 className={`text-4xl md:text-5xl font-bold text-white mb-2 ${interBold.variable}`}>{topic.label}</h1>
          <p className="text-lg text-blue-100 mb-2 max-w-2xl mx-auto">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this topic
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <section aria-label="Posts in this topic" className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Fresh Blog Posts
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Stay updated with our latest insights and discoveries in the {topic.label} topic.
              </p>
            </div>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
              {posts.map((post) => (
                <PostList 
                  key={post._id} 
                  post={post} 
                  aspect="rectangle"
                  minimal={false}
                  pathPrefix="post"
                  preloadImage={false}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
