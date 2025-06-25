/*
import HomePage from "./home";
import { getAllPosts } from "@/lib/sanity/client";


export default async function IndexPage() {
  const posts = await getAllPosts();
  return <HomePage posts={posts} />;
}
*/




import HomePage from "./home";
import { getAllPosts, getAllSectors } from "@/lib/sanity/client";

export default async function IndexPage() {
  const posts = await getAllPosts();
  const sectors = await getAllSectors();
  return <HomePage posts={posts} sectors={sectors} />;
}

export const revalidate = 60; // Revalidate every 60 seconds