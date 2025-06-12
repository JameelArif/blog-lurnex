import { getAuthorPostsBySlug } from "./client";

export async function getAuthor(slug: string) {
  const authorData = await getAuthorPostsBySlug(slug);
  return authorData.author || null;
}

export async function getAuthorPosts(slug: string) {
  const authorData = await getAuthorPostsBySlug(slug);
  return authorData.posts || [];
} 