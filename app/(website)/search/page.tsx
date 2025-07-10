import { getAllPosts, getAllAuthors, getAllCategories, getAllSectors, getAllCharacters, getAllTopics, client } from "@/lib/sanity/client";
import PostList from "@/components/postlist";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchForm from "@/components/SearchForm";

export const revalidate = 60;

export async function generateMetadata({ searchParams }) {
  const query = searchParams.q || '';
  return {
    title: query ? `Search Results for "${query}" | Lurnex Blog` : 'Search | Lurnex Blog',
    description: `Search results for "${query}" on Lurnex Blog. Find articles, tutorials, and insights about technology and innovation.`,
  };
}

export default async function SearchPage({ searchParams }) {
  try {
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
      sector->{ 
        label, 
        "iconUrl": icon.asset->url, 
        "slug": slug.current 
      },
      character->{ 
        label, 
        "iconUrl": icon.asset->url, 
        "slug": slug.current 
      },
      topic->{ 
        label, 
        "iconUrl": icon.asset->url, 
        "slug": slug.current 
      }
    }`;

    console.log('GROQ Query:', postsQuery);
    console.log('Query Params:', params);

    const [posts, authors, categories, sectors, characters, topics] = await Promise.all([
      client.fetch(postsQuery, params),
      getAllAuthors(),
      getAllCategories(),
      getAllSectors(),
      getAllCharacters(),
      getAllTopics(),
    ]);

    // Debug logging
    console.log('Search Debug:', {
      query,
      selectedSector,
      selectedCharacter,
      selectedTopic,
      filters,
      params,
      postsCount: posts.length,
      sectors: sectors.map(s => ({ label: s.label, slug: s.slug?.current })),
      characters: characters.map(c => ({ label: c.label, slug: c.slug?.current })),
      topics: topics.map(t => ({ label: t.label, slug: t.slug?.current }))
    });

    // Filter authors, categories, sectors, characters, topics for display
    const filteredAuthors = authors.filter(author =>
      author.name?.toLowerCase().includes(query)
    );

    const filteredCategories = categories.filter(category =>
      category.title?.toLowerCase().includes(query)
    );

    const filteredSectors = sectors.filter(sector =>
      sector.label?.toLowerCase().includes(query)
    );

    const filteredCharacters = characters.filter(character =>
      character.label?.toLowerCase().includes(query)
    );

    const filteredTopics = topics.filter(topic =>
      topic.label?.toLowerCase().includes(query)
    );

    const activeFiltersCount = Object.values({
      q: query,
      title: selectedTitle,
      author: selectedAuthor,
      category: selectedCategory,
      sector: selectedSector,
      character: selectedCharacter,
      topic: selectedTopic,
      publishedFrom,
      publishedTo
    }).filter(value => value !== '').length;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Search
              </h1>
              <p className="text-gray-600 mb-6">
                Find articles, authors, and categories across our blog
              </p>

              {/* Search Form */}
              <SearchForm 
                initialFilters={{
                  q: query,
                  title: selectedTitle,
                  author: selectedAuthor,
                  category: selectedCategory,
                  sector: selectedSector,
                  character: selectedCharacter,
                  topic: selectedTopic,
                  publishedFrom,
                  publishedTo
                }}
                authors={authors}
                categories={categories}
                sectors={sectors}
                characters={characters}
                topics={topics}
                activeFiltersCount={activeFiltersCount}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Results Summary */}
            <div className="mb-8">
              <p className="text-gray-600">
                Found {posts.length} posts, {filteredAuthors.length} authors, and {filteredCategories.length} categories
              </p>
            </div>

            {/* Posts Results */}
            {posts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
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
              </div>
            )}

            {/* Authors Results */}
            {filteredAuthors.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Authors</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAuthors.map(author => {
                    const authorImageUrl = author.image ? urlForImage(author.image) : null;
                    return (
                      <Link
                        key={author._id}
                        href={`/author/${author.slug?.current}`}
                        className="group bg-white rounded-lg border border-gray-200 p-6 flex items-center space-x-4 transition-transform hover:scale-105 hover:shadow-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ minHeight: 110 }}
                      >
                        {authorImageUrl ? (
                          <img 
                            src={authorImageUrl.src} 
                            alt={author.name} 
                            className="w-16 h-16 rounded-full object-cover shadow-md border border-gray-200 bg-white group-hover:border-blue-400 transition"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shadow-md border border-gray-200">
                            <span className="text-gray-500 text-lg font-semibold">
                              {author.name?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {author.name}
                          </h3>
                          {author.bio && (
                            <div className="text-gray-600 text-sm overflow-hidden">
                              {typeof author.bio === 'string' ? (
                                <p className="line-clamp-2">{author.bio}</p>
                              ) : (
                                <div className="line-clamp-2">
                                  <PortableText value={author.bio} />
                                </div>
                              )}
                            </div>
                          )}
                          <span className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block transition-colors">View Profile →</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Results */}
            {posts.length === 0 && filteredAuthors.length === 0 && filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <Link
                    href="/search"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear all filters
                  </Link>
                </div>
              </div>
            )}

            {/* Sectors Results */}
            {filteredSectors.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sectors</h2>
                <div className="flex flex-wrap gap-6">
                  {filteredSectors.map(sector => (
                    <Link
                      key={sector._id}
                      href={`/sector/${sector.slug?.current}`}
                      className="group flex flex-col items-center transition-transform hover:scale-110"
                      style={{ minWidth: 80 }}
                    >
                      {sector.iconUrl && (
                        <img
                          src={sector.iconUrl}
                          alt={sector.label}
                          className="w-16 h-16 rounded-full shadow-md border border-gray-200 bg-white group-hover:border-blue-400 transition"
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                      <span className="mt-2 text-sm font-medium text-gray-700 text-center">{sector.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Characters Results */}
            {filteredCharacters.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Characters</h2>
                <div className="flex flex-wrap gap-6">
                  {filteredCharacters.map(character => (
                    <Link
                      key={character._id}
                      href={`/character/${character.slug?.current}`}
                      className="group flex flex-col items-center transition-transform hover:scale-110"
                      style={{ minWidth: 80 }}
                    >
                      {character.iconUrl && (
                        <img
                          src={character.iconUrl}
                          alt={character.label}
                          className="w-16 h-16 rounded-full shadow-md border border-gray-200 bg-white group-hover:border-blue-400 transition"
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                      <span className="mt-2 text-sm font-medium text-gray-700 text-center">{character.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Topics Results */}
            {filteredTopics.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Topics</h2>
                <div className="flex flex-wrap gap-6">
                  {filteredTopics.map(topic => (
                    <Link
                      key={topic._id}
                      href={`/topic/${topic.slug?.current}`}
                      className="group flex flex-col items-center transition-transform hover:scale-110"
                      style={{ minWidth: 80 }}
                    >
                      {topic.iconUrl && (
                        <img
                          src={topic.iconUrl}
                          alt={topic.label}
                          className="w-16 h-16 rounded-full shadow-md border border-gray-200 bg-white group-hover:border-blue-400 transition"
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                      <span className="mt-2 text-sm font-medium text-gray-700 text-center">{topic.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Results */}
            {/*
            {filteredCategories.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
                <div className="flex flex-wrap gap-3">
                  {filteredCategories.map(category => (
                    <Link 
                      key={category._id} 
                      href={`/category/${category.slug?.current}`} 
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 transition-colors"
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            */}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Search page error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">We're having trouble loading the search page.</p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }
} 