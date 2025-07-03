import { client, getSettings } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import PostPage from "./default";
import Comments from "@/components/blog/comments";
import CommentForm from "@/components/blog/commentForm";

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post" && defined(slug.current)]{
    "slug": slug.current
  }`);
  return posts;
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const settings = await getSettings();
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      "authorName": author->name,
      excerpt,
      mainImage,
      publishedAt,
      seo
    }`,
    { slug }
  );

  const {
    title,
    authorName,
    excerpt: description,
    mainImage,
    publishedAt,
    seo
  } = post;

  // Defensive date handling
  const publishedDate = publishedAt ? new Date(publishedAt) : null;
  const publishedIso = publishedDate && !isNaN(publishedDate) ? publishedDate.toISOString() : undefined;

  const seoTitle = seo?.title || title;
  const seoDesc = seo?.description || description;
  const seoImage = seo?.image ? urlForImage(seo.image) : urlForImage(mainImage);

  return {
    title: seoTitle,
    description: seoDesc,
    canonical: `${settings.url}/post/${slug}`,
    openGraph: {
      url: `${settings.url}/post/${slug}`,
      title: seoTitle,
      description: seoDesc,
      type: "article",
      article: {
        publishedTime: publishedIso,
        authors: [authorName]
      },
      images: [
        {
          url: seoImage.src,
          width: 800,
          height: 600,
          alt: seoTitle
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      site: `@${settings?.twitter}`,
      creator: `@${settings?.twitter}`,
      images: [seoImage.src]
    },
    robots: {
      index: !seo?.noindex,
      follow: !seo?.noindex
    }
  };
}

export default async function Post({ params }) {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt,
      excerpt,
      body,
      categories[]->{
        title,
        "slug": slug.current
      },
      author->{
        name,
        "slug": slug.current,
        image,
        bio
      }
    }`,
    { slug: params.slug }
  );

  const comments = await client.fetch(
    `*[_type == "comment" && post->_id == $postId && approved == true] | order(_createdAt desc) {
      _id,
      name,
      content,
      _createdAt
    }`,
    { postId: post?._id }
  );

  if (!post) {
    return null;
  }

  // Defensive date handling
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null;
  const publishedIso = publishedDate && !isNaN(publishedDate) ? publishedDate.toISOString() : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": urlForImage(post.mainImage).src,
    "datePublished": publishedIso,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": `${process.env.NEXT_PUBLIC_URL}/author/${post.author.slug}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lurnex",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_URL}/logo.png`
      }
    },
    "description": post.excerpt
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
