import { getAllPosts, getAllAuthors, getAllCategories } from "@/lib/sanity/client";
import PostList from "@/components/postlist";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";

export const revalidate = 60;

export async function generateMetadata({ searchParams }) {
  const query = searchParams.q || '';
  return {
    title: query ? `Search Results for "${query}" | Lurnex Blog` : 'Search | Lurnex Blog',
    description: `Search results for "${query}" on Lurnex Blog. Find articles, tutorials, and insights about technology and innovation.`,
  };
}

function plainTextFromPortableText(body) {
  if (!Array.isArray(body)) return '';
  return body.map(block => (block.children ? block.children.map(child => child.text).join('') : '')).join('\n');
}

export default async function SearchPage({ searchParams }) {
  const query = (searchParams.q || '').toLowerCase();
  const [posts, authors, categories] = await Promise.all([
    getAllPosts(),
    getAllAuthors(),
    getAllCategories(),
  ]);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const searchContent = `
      ${post.title}
      ${post.excerpt}
      ${(post.categories || []).map(cat => cat.title).join(' ')}
      ${plainTextFromPortableText(post.body)}
    `.toLowerCase();
    return searchContent.includes(query);
  });

  // Filter authors
  const filteredAuthors = authors.filter(author =>
    author.name?.toLowerCase().includes(query)
  );

  // Filter categories
  const filteredCategories = categories.filter(category =>
    category.title?.toLowerCase().includes(query)
  );

  return (
    <div className="bg-white">
      {/* Search Results Header */}
      <div className="relative bg-lurnex-blue py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {query ? `Search Results for "${query}"` : 'Search'}
            </h1>
            <p className="text-lg text-blue-100">
              {filteredPosts.length + filteredAuthors.length + filteredCategories.length} result{filteredPosts.length + filteredAuthors.length + filteredCategories.length === 1 ? '' : 's'} found
            </p>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Posts Results */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Posts</h2>
              {filteredPosts.length > 0 ? (
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
                  {filteredPosts.map((post) => (
                    <PostList
                      key={post._id}
                      post={post}
                      aspect="rectangle"
                      minimal={false}
                      pathPrefix=""
                      preloadImage={false}
                      fontSize="large"
                      fontWeight="normal"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No posts found.</div>
              )}
            </div>

            {/* Authors Results */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Authors</h2>
              {filteredAuthors.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-12">
                  {filteredAuthors.map(author => {
                    const authorImageUrl = author.image ? urlForImage(author.image) : null;
                    return (
                      <div key={author._id} className="p-6 rounded-xl border bg-gray-50 flex flex-col items-center text-center">
                        {authorImageUrl && (
                          <img src={authorImageUrl.src} alt={author.name} className="w-20 h-20 rounded-full object-cover mb-3" />
                        )}
                        <h3 className="text-lg font-semibold mb-1">{author.name}</h3>
                        {author.bio && <div className="text-gray-600 text-sm mb-2"><PortableText value={author.bio} /></div>}
                        <Link href={`/author/${author.slug}`} className="text-lurnex-blue font-medium hover:underline">View Profile</Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500">No authors found.</div>
              )}
            </div>

            {/* Categories Results */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Categories</h2>
              {filteredCategories.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {filteredCategories.map(category => (
                    <Link key={category._id || category.slug} href={`/category/${category.slug?.current || category.slug}`} className="px-4 py-2 rounded-full bg-blue-100 text-lurnex-blue font-medium hover:bg-blue-200">
                      {category.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No categories found.</div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 