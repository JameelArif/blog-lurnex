import PostPage from "./default";

import { getAllPostsSlugs, getPostBySlug } from "@/lib/sanity/client";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    title: `${post.title} | Lurnex`,
    description: post.excerpt || 'Read this post on Lurnex, empowering businesses through innovative technology solutions.',
    openGraph: {
      title: `${post.title} | Lurnex`,
      description: post.excerpt || 'Read this post on Lurnex, empowering businesses through innovative technology solutions.',
      images: [`/post/${params.slug}/opengraph-image`],
    },
  };
}

export default async function PostDefault({ params }) {
  const post = await getPostBySlug(params.slug);
  return <PostPage post={post} />;
}

export const revalidate = 60;
