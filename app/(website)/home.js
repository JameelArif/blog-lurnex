import Link from "next/link";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import SectorList from "@/components/blog/sectorList";
import Image from "next/image";

export default function HomePage({ posts, sectors }) {
  // Only show the latest 3 posts
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      {/* Hero Banner */}
      <div className="relative w-full bg-[#2DA9E1] shadow-lg overflow-hidden">
        <div className="relative w-full h-48 md:h-64 lg:h-80 xl:h-96">
          <Image
            src="/img/top.png"
            alt="Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col justify-center">
            <Container>
              <h1 className="text-white drop-shadow-2xl md:leading-tight text-4xl md:text-5xl font-extrabold">
                <span className="drop-shadow-2xl">Discover our</span>
                <br />
                <span className="drop-shadow-2xl">stories and insights</span>
              </h1>
            </Container>
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