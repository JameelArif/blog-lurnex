import PostPage from "./default";
import { client } from "@/lib/sanity/client";
import Comments from "@/components/blog/comments";
import CommentForm from "@/components/blog/commentForm";

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
  const [post, comments] = await Promise.all([
    client.fetch(`*[_type == "post" && slug.current == $slug][0] {
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
    }`, { slug: params.slug }),
    client.fetch(`*[_type == "comment" && post->slug.current == $slug && approved == true] | order(createdAt desc) {
      _id,
      name,
      content,
      createdAt
    }`, { slug: params.slug })
  ]);

  if (!post) {
    return null;
  }

  return (
    <>
      <PostPage post={post} />
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <Comments comments={comments} />
          <CommentForm postId={post._id} />
        </div>
      </div>
    </>
  );
}

export const revalidate = 60;
