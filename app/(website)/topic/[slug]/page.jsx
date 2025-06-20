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
  const topic = await client.fetch(
    `*[_type == "topic" && slug.current == $slug][0]`,
    { slug: params.slug }
  );

  if (!topic) {
    return {
      title: 'Topic Not Found | Lurnex Blog',
      description: 'The requested topic could not be found.',
    };
  }

  return {
    title: `${topic.label} Posts | Lurnex`,
    description: `Browse all posts in the ${topic.label} topic on Lurnex, the platform for innovative technology solutions and insights.`,
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
    `*[_type == "topic" && slug.current == $slug][0]`,
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

  return (
    <div className="bg-white">
      {/* Topic Hero Section */}
      <div className="relative bg-lurnex-blue py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${interBold.variable}`}>
              {topic.label}
            </h1>
            <p className="text-lg text-blue-100">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this topic
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
