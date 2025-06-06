import Link from "next/link";
import Container from "@/components/container";
import PostList from "@/components/postlist";

export default function Post({ posts }) {
  return (
    <>
      <div className="relative w-full h-48 md:h-[32vh] lg:h-[40vh] xl:h-[48vh] 2xl:h-[56vh]">
        <img
          src="/img/top.png"
          alt="Banner"
          className="object-cover w-full h-full rounded-xl shadow-lg"
        />
        <div className="absolute inset-0 flex  items-center justify-start pl-16">
          <h1 className="text-white drop-shadow-2xl md:leading-tight text-4xl md:text-5xl font-extrabold">
            <span className="drop-shadow-2xl">Discover our</span>
            <div className="drop-shadow-2xl">
            stories and insights
            </div>
          </h1>
        </div>
      </div>
      {posts && (
        <Container>

          <div className="grid gap-10 md:grid-cols-2 lg:gap-10 ">
            {posts.slice(0, 2).map(post => (
              <PostList
                key={post._id}
                post={post}
                aspect="landscape"
                preloadImage={true}
              />
            ))}
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
            {posts.slice(2, 14).map(post => (
              <PostList key={post._id} post={post} aspect="square" />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/archive"
              className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300">
              <span>View all Posts</span>
            </Link>
          </div>
        </Container>
      )}
    </>
  );
}
