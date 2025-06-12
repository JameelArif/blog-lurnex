import Link from "next/link";
import Container from "@/components/container";
import PostList from "@/components/postlist";

export default function HomePage({ posts, selectedCategory }) {
  // Get all unique categories from posts
  const categories = [
    "All Posts",
    ...Array.from(
      new Set(
        posts.flatMap(post =>
          post.categories ? post.categories.map(cat => cat.title) : []
        )
      )
    ),
  ];

  // Filter posts based on selectedCategory
  const filteredPosts =
    selectedCategory === "All Posts"
      ? posts
      : posts.filter(post =>
          post.categories &&
          post.categories.some(cat => cat.title === selectedCategory)
        );

  return (
    <>
      <div className="relative w-full h-48 md:h-[32vh] lg:h-[40vh] xl:h-[48vh] 2xl:h-[56vh] shadow-lg bg-[#2DA9E1] overflow-hidden">
        <img
          src="/img/top.png"
          alt="Banner"
          className="object-cover w-full h-full shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-start pl-16">
          <h1 className="text-white drop-shadow-2xl md:leading-tight text-4xl md:text-5xl font-extrabold">
            <span className="drop-shadow-2xl">Discover our</span>
            <div className="drop-shadow-2xl">
              stories and insights
            </div>
          </h1>
        </div>
      </div>

      <Container>
        {/* Category List */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-10">
          {categories.map(category => (
            <Link
              key={category}
              href={category === "All Posts" ? "/" : `/?category=${encodeURIComponent(category)}`}
              className={`
                px-2 py-1
                sm:px-3 sm:py-1.5
                md:px-4 md:py-2
                text-xs sm:text-sm md:text-base
                rounded-full
                ${selectedCategory === category
                  ? "bg-blue-100  font-semibold"
                  : "bg-blue-50  font-medium"}
                hover:bg-blue-200 transition
              `}
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
          {filteredPosts.slice(0, 14).map(post => (
            <PostList key={post._id} post={post} aspect="rectangle" />
          ))}
        </div>
      </Container>
    </>
  );
}