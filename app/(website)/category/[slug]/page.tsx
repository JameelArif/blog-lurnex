import { getSettings } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { getPostsByCategory, getCategory } from "@/lib/sanity/client";
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
  const { slug } = params;
  const settings = await getSettings();
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }
  
  const { title, description, seo } = category;
  const seoTitle = seo?.title || title;
  const seoDesc = seo?.description || description;
  const seoImageSrc = seo?.image ? urlForImage(seo.image)?.src : urlForImage(settings.openGraphImage)?.src;


  return {
    title: seoTitle,
    description: seoDesc,
    canonical: `${settings.url}/category/${slug}`,
    openGraph: {
      url: `${settings.url}/category/${slug}`,
      title: seoTitle,
      description: seoDesc,
      images: [
        {
          url: seoImageSrc || '/img/opengraph.jpg',
          width: 800,
          height: 600,
          alt: seoTitle
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: [seoImageSrc || '/img/opengraph.jpg']
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex
    }
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
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16 items-stretch">
              {posts.map((post) => (
                <PostList 
                  key={post._id} 
                  post={post} 
                  aspect="rectangle" 
                  minimal={false} 
                  pathPrefix="post" 
                  preloadImage={false}
                  fontSize="large"
                  fontWeight="bold"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 