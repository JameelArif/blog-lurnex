import { getAllPosts, getAllAuthors, getAllCategories, getAllSectors, getAllCharacters, getAllTopics } from "@/lib/sanity/client";
import PostList from "@/components/postlist";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import { client } from "@/lib/sanity/client";

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
  // Read filters from searchParams
  const selectedAuthor = searchParams.author || '';
  const selectedCategory = searchParams.category || '';
  const selectedSector = searchParams.sector || '';
  const selectedCharacter = searchParams.character || '';
  const selectedTopic = searchParams.topic || '';
  const selectedTitle = searchParams.title || '';
  const publishedFrom = searchParams.publishedFrom || '';
  const publishedTo = searchParams.publishedTo || '';
  const query = (searchParams.q || '').toLowerCase();

  // Build dynamic GROQ filter
  let filters: string[] = [];
  let params: Record<string, any> = {};
  if (selectedAuthor) {
    filters.push('author->slug.current == $author');
    params.author = selectedAuthor;
  }
  if (selectedCategory) {
    filters.push('$category in categories[]->slug.current');
    params.category = selectedCategory;
  }
  if (selectedSector) {
    filters.push('sector->slug.current == $sector');
    params.sector = selectedSector;
  }
  if (selectedCharacter) {
    filters.push('character->slug.current == $character');
    params.character = selectedCharacter;
  }
  if (selectedTopic) {
    filters.push('topic->slug.current == $topic');
    params.topic = selectedTopic;
  }
  if (selectedTitle) {
    filters.push('title match $title');
    params.title = `*${selectedTitle}*`;
  }
  if (publishedFrom) {
    filters.push('publishedAt >= $publishedFrom');
    params.publishedFrom = publishedFrom;
  }
  if (publishedTo) {
    filters.push('publishedAt <= $publishedTo');
    params.publishedTo = publishedTo;
  }
  if (query) {
    filters.push('(title match $query || excerpt match $query)');
    params.query = `*${query}*`;
  }
  const whereClause = filters.length > 0 ? `[_type == "post" && ${filters.join(' && ')}]` : '[_type == "post"]';
  const postsQuery = `*${whereClause} | order(publishedAt desc, _createdAt desc) {
    _id,
    _createdAt,
    publishedAt,
    mainImage {
      ...,
      "blurDataURL":asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background,
    },
    featured,
    excerpt,
    slug,
    title,
    author-> {
      _id,
      image,
      slug,
      name
    },
    categories[]->,
    sector->{ label, "iconUrl": icon.asset->url, "slug": slug.current },
    character->{ label, "iconUrl": icon.asset->url, "slug": slug.current },
    topic->{ label, "iconUrl": icon.asset->url, "slug": slug.current }
  }`;

  const [posts, authors, categories, sectors, characters, topics] = await Promise.all([
    client.fetch(postsQuery, params),
    getAllAuthors(),
    getAllCategories(),
    getAllSectors(),
    getAllCharacters(),
    getAllTopics(),
  ]);

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
      {/* Filter Bar */}
      <form className="container mx-auto px-4 lg:px-8 py-8 bg-blue-50 rounded-xl mt-8 mb-12" method="GET">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Post Name */}
          <div>
            <label className="block text-xs font-medium mb-1">Post Name</label>
            <input type="text" name="title" defaultValue={selectedTitle} className="px-2 py-1 border rounded-md" placeholder="Post title..." />
          </div>
          {/* Author */}
          <div>
            <label className="block text-xs font-medium mb-1">Author</label>
            <select name="author" defaultValue={selectedAuthor} className="px-2 py-1 border rounded-md">
              <option value="">All</option>
              {authors.map(author => (
                <option key={author._id} value={author.slug.current}>{author.name}</option>
              ))}
            </select>
          </div>
          {/* Category */}
          <div>
            <label className="block text-xs font-medium mb-1">Category</label>
            <select name="category" defaultValue={selectedCategory} className="px-2 py-1 border rounded-md">
              <option value="">All</option>
              {categories.map(category => (
                <option key={category._id} value={category.slug.current}>{category.title}</option>
              ))}
            </select>
          </div>
          {/* Sector */}
          <div>
            <label className="block text-xs font-medium mb-1">Sector</label>
            <select name="sector" defaultValue={selectedSector} className="px-2 py-1 border rounded-md">
              <option value="">All</option>
              {sectors.map(sector => (
                <option key={sector._id} value={sector.slug}>{sector.label}</option>
              ))}
            </select>
          </div>
          {/* Character */}
          <div>
            <label className="block text-xs font-medium mb-1">Character</label>
            <select name="character" defaultValue={selectedCharacter} className="px-2 py-1 border rounded-md">
              <option value="">All</option>
              {characters.map(character => (
                <option key={character._id} value={character.slug}>{character.label}</option>
              ))}
            </select>
          </div>
          {/* Topic */}
          <div>
            <label className="block text-xs font-medium mb-1">Topic</label>
            <select name="topic" defaultValue={selectedTopic} className="px-2 py-1 border rounded-md">
              <option value="">All</option>
              {topics.map(topic => (
                <option key={topic._id} value={topic.slug}>{topic.label}</option>
              ))}
            </select>
          </div>
          {/* Publish Date Range */}
          <div>
            <label className="block text-xs font-medium mb-1">Published From</label>
            <input type="date" name="publishedFrom" defaultValue={publishedFrom} className="px-2 py-1 border rounded-md" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Published To</label>
            <input type="date" name="publishedTo" defaultValue={publishedTo} className="px-2 py-1 border rounded-md" />
          </div>
          <button type="submit" className="ml-4 px-4 py-2 bg-lurnex-blue text-white rounded-md font-semibold">Apply Filters</button>
        </div>
      </form>

      {/* Search Results Header */}
      <div className="relative bg-lurnex-blue py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {query ? `Search Results for "${query}"` : 'Search'}
            </h1>
            <p className="text-lg text-blue-100">
              {posts.length + filteredAuthors.length + filteredCategories.length} result{posts.length + filteredAuthors.length + filteredCategories.length === 1 ? '' : 's'} found
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
              {posts.length > 0 ? (
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
                  {posts.map((post) => (
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
                        <Link href={`/author/${author.slug.current}`} className="text-lurnex-blue font-medium hover:underline">View Profile</Link>
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