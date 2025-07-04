import { getSettings } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import { getAuthor, getAuthorPosts } from "@/lib/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = params;
  const settings = await getSettings();
  const author = await getAuthor(slug);
  
  if (!author) {
    return {
      title: 'Author Not Found',
      description: 'The requested author could not be found.',
    };
  }

  const { name, bio, image, seo } = author;
  const seoTitle = seo?.title || name;
  const seoDesc = seo?.description || bio?.[0]?.children?.[0]?.text; // Basic text extraction
  const seoImage = seo?.image ? urlForImage(seo.image) : (image ? urlForImage(image) : null);

  return {
    title: seoTitle,
    description: seoDesc,
    canonical: `${settings.url}/author/${slug}`,
    openGraph: {
      url: `${settings.url}/author/${slug}`,
      title: seoTitle,
      description: seoDesc,
      images: seoImage ? [
        {
          url: seoImage.src,
          width: 800,
          height: 600,
          alt: seoTitle,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
      images: seoImage ? [seoImage.src] : [],
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex,
    }
  };
}

export default async function AuthorPage({ params }) {
  const author = await getAuthor(params.slug);
  
  if (!author) {
    notFound();
  }

  const posts = await getAuthorPosts(params.slug);
  const authorImageUrl = author.image ? urlForImage(author.image) : null;

  return (
    <div className="bg-white">
      {/* Author Hero Section */}
      <div className="relative bg-lurnex-blue py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Author Image */}
              <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 flex items-center justify-center overflow-hidden rounded-full bg-blue-400">
                {authorImageUrl && (
                  <Image
                    src={authorImageUrl.src}
                    alt={author.name}
                    width={192}
                    height={192}
                    className="object-cover aspect-square"
                  />
                )}
              </div>
              
              {/* Author Info */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {author.name}
                </h1>
                {author.bio && (
                  <div className="text-lg text-blue-100">
                    <PortableText value={author.bio} />
                  </div>
                )}
                {author.socialLinks && (
                  <div className="flex justify-center md:justify-start gap-4 mt-4">
                    {author.socialLinks.twitter && (
                      <a
                        href={author.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-200"
                      >
                        <span className="sr-only">Twitter</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                    {author.socialLinks.linkedin && (
                      <a
                        href={author.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-200"
                      >
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {author.socialLinks.github && (
                      <a
                        href={author.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-200"
                      >
                        <span className="sr-only">GitHub</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Posts Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Posts by {author.name}
            </h2>
            
            <div className="grid gap-12">
              {posts.map((post) => {
                const postImageUrl = post.mainImage ? urlForImage(post.mainImage) : null;
                const dateString = post.publishedAt || post._createdAt;
                return (
                  <article key={post._id} className="flex flex-col md:flex-row gap-8">
                    {/* Post Image */}
                    {postImageUrl && (
                      <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                        <Image
                          src={postImageUrl.src}
                          alt={post.title}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Post Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        <Link href={`/post/${post.slug.current}`} className="hover:text-lurnex-blue">
                          {post.title}
                        </Link>
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <time dateTime={dateString}>
                          {(() => {
                            try {
                              if (!dateString) return "Unknown date";
                              const date = new Date(dateString);
                              if (isNaN(date.getTime())) return "Invalid date";
                              return date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              });
                            } catch (error) {
                              return "Invalid date";
                            }
                          })()}
                        </time>
                        {post.categories && post.categories.length > 0 && (
                          <div className="flex gap-2">
                            {post.categories.map((category) => (
                              <Link
                                key={category._id}
                                href={`/category/${category.slug.current}`}
                                className="text-lurnex-blue hover:text-lurnex-blue-dark"
                              >
                                {category.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 