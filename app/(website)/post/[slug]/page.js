import PostPage from "./default";
import { client } from "@/lib/sanity/client";

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"] {
    slug
  }`);
  
  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

export async function generateMetadata({ params }) {
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    body,
    categories[]->{
      title,
      slug
    },
    author->{
      name,
      slug,
      image,
      bio
    }
  }`, { slug: params.slug });

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
      openGraph: {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
        images: [],
      },
    };
  }

  return {
    title: `${post.title} | Lurnex`,
    description: post.excerpt || 'Read this post on Lurnex, empowering businesses through innovative technology solutions.',
    openGraph: {
      title: `${post.title} | Lurnex`,
      description: post.excerpt || 'Read this post on Lurnex, empowering businesses through innovative technology solutions.',
      images: [post.mainImage],
    },
  };
}

export default async function Post({ params }) {
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    excerpt,
    body,
    categories[]->{
      title,
      slug
    },
    author->{
      name,
      slug,
      image,
      bio
    }
  }`, { slug: params.slug });

  if (!post) {
    return null;
  }

  return <PostPage post={post} />;
}

export const revalidate = 60;
