/*
import HomePage from "./home";
import { getAllPosts } from "@/lib/sanity/client";


export default async function IndexPage() {
  const posts = await getAllPosts();
  return <HomePage posts={posts} />;
}
*/




import HomePage from "./home";
import { getAllPosts } from "@/lib/sanity/client";

export default async function IndexPage({ searchParams }) {
  const posts = await getAllPosts();
  const selectedCategory = searchParams?.category || "All Posts";
  return <HomePage posts={posts} selectedCategory={selectedCategory} />;
}

export const revalidate = 60; // Revalidate every 60 seconds