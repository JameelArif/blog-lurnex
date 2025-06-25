import Link from "next/link";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import SectorList from "@/components/blog/sectorList";

export default function HomePage({ posts, sectors }) {
  // Only show the latest 3 posts
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-[32vh] lg:h-[40vh] xl:h-[48vh] 2xl:h-[56vh] shadow-lg bg-[#2DA9E1] overflow-hidden">
        <img
          src="/img/top.png"
          alt="Banner"
          className="object-cover w-full h-full shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-start pl-8 md:pl-16">
          <h1 className="text-white drop-shadow-2xl md:leading-tight text-4xl md:text-5xl font-extrabold">
            <span className="drop-shadow-2xl">Discover our</span>
            <div className="drop-shadow-2xl">stories and insights</div>
          </h1>
        </div>
      </div>

      {/* Sectors Section (new grid) */}
      <SectorList sectors={sectors} />

      <Container>
        {/* Latest Posts Section */}
        <section aria-label="Latest Posts" className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center tracking-tight">
            Latest Posts
          </h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
            {latestPosts.map(post => (
              <PostList key={post._id} post={post} aspect="rectangle" />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}