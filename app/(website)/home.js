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
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-cover bg-center shadow-lg bg-[#2DA9E1]" style={{backgroundImage: "url('/img/top.png')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative h-full flex flex-col justify-center items-start px-8 md:px-16 lg:px-24">
          <div className="max-w-xl">
            <h1 className="text-white drop-shadow-2xl text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Discover our
              <br className="hidden md:block" />
              <span className="text-white"> stories and insights</span>
            </h1>
          </div>
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