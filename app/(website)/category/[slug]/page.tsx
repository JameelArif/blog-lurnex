import { urlForImage } from "@/lib/sanity/image";
import { getPostsByCategory } from "@/lib/sanity/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostList from "@/components/postlist";
import localFont from 'next/font/local';

const interBold = localFont({
  src: '../../../../public/fonts/Inter-Bold.otf',
  variable: '--font-inter-bold',
});

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const posts = await getPostsByCategory(params.slug);
  const category = posts.length > 0
    ? posts[0].categories?.find(cat => cat.slug.current === params.slug)
    : null;

  if (!category) {
    return {
      title: 'Category Not Found | Lurnex Blog',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.title} Posts | Lurnex`,
    description: `Browse all posts in the ${category.title} category on Lurnex, the platform for innovative technology solutions and insights.`,
  };
}

export default async function CategoryPage({ params }) {
  const posts = await getPostsByCategory(params.slug);
  const category = posts.length > 0
    ? posts[0].categories?.find(cat => cat.slug.current === params.slug)
    : null;
  
  if (!category) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Category Hero Section */}
      <div className="relative bg-lurnex-blue py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${interBold.variable}`}>
              {category.title}
            </h1>
            <p className="text-lg text-blue-100">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
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