import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { cache } from "react";
import { postsbycatquery } from "./groq";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = "2024-03-19";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

export const fetcher = async ([query, params]) => {
  return client ? client.fetch(query, params) : [];
};

(async () => {
  if (client) {
    const data = await client.fetch(`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      categories[]->{
        title,
        slug
      },
      author->{
        name,
        slug,
        image
      }
    }`);
    if (!data || !data.length) {
      console.error(
        "Sanity returns empty array. Are you sure the dataset is public?"
      );
    }
  }
})();

export async function getAllPosts() {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    categories[]->{
      title,
      slug
    },
    author->{
      name,
      slug,
      image
    },
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
  }`);
}

export async function getSettings() {
  return client.fetch(`*[_type == "config"] {
    _id,
    title,
    description,
    keywords,
    author,
    image
  }`);
}

export async function getPostBySlug(slug) {
  return client.fetch(`*[_type == "post" && slug.current == "${slug}"] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    categories[]->{
      title,
      slug
    },
    author->{
      name,
      slug,
      image
    }
  }`);
}

export async function getAllPostsSlugs() {
  return client.fetch(`*[_type == "post"] {
    _id,
    slug
  }`);
}

// Author
export async function getAllAuthorsSlugs() {
  return client.fetch(`*[_type == "author"] {
    _id,
    slug
  }`);
}

export async function getAuthorPostsBySlug(slug) {
  return client.fetch(`{
    "author": *[_type == "author" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      image,
      bio,
      socialLinks
    },
    "posts": *[_type == "post" && author->slug.current == $slug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      categories[]->{
        title,
        slug
      },
      author->{
        name,
        slug,
        image
      }
    }
  }`, { slug });
}

export async function getAllAuthors() {
  return client.fetch(`*[_type == "author"] {
    _id,
    name,
    slug,
    image,
    bio
  }`);
}

// Category

export async function getAllCategories() {
  return client.fetch(`*[_type == "category"] {
    _id,
    title,
    slug
  }`);
}

export const getPostsByCategory = cache(async (slug: string) => {
  return client.fetch(postsbycatquery, { slug });
});

export const getCategory = cache(async (slug: string) => {
  return client.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug }
  );
});

export async function getTopCategories() {
  return client.fetch(`*[_type == "category"] {
    _id,
    title,
    slug
  }`);
}

export async function getPaginatedPosts({ limit, pageIndex = 0 }) {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    categories[]->{
      title,
      slug
    },
    author->{
      name,
      slug,
      image
    }
  } | [${pageIndex} * ${limit}...${(pageIndex + 1) * limit}]`);
}

export async function getAllSectors() {
  return client.fetch(`*[_type == "sector"]{
    _id,
    label,
    slug,
    description,
    blockImage,
    heroImage,
    icon,
    "blockImageUrl": blockImage.asset->url,
    "heroImageUrl": heroImage.asset->url,
    "iconUrl": icon.asset->url
  }`);
}

export async function getAllCharacters() {
  return client.fetch(`*[_type == "character"]{ _id, label, slug, icon, "iconUrl": icon.asset->url }`);
}

export async function getAllTopics() {
  return client.fetch(`*[_type == "topic"]{ _id, label, slug, icon, "iconUrl": icon.asset->url }`);
}
