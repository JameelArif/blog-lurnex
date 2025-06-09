{/*
import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CategoryLabel from "@/components/blog/category";

export default function PostList({
  post,
  aspect,
  minimal,
  pathPrefix,
  preloadImage,
  fontSize,
  fontWeight
}) {
  const imageProps = post?.mainImage ? urlForImage(post.mainImage) : null;
  const AuthorimageProps = post?.author?.image ? urlForImage(post.author.image) : null;
  const authorSlug = post?.author?.slug?.current;

  return (
    <div className={cx("group cursor-pointer", minimal && "grid gap-10 md:grid-cols-2")}>
      <div className={cx("overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-105 dark:bg-gray-800")}>
        <Link
          className={cx(
            "relative block",
            aspect === "landscape"
              ? "aspect-video"
              : aspect === "custom"
              ? "aspect-[5/4]"
              : "aspect-square"
          )}
          href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${post?.slug?.current || ""}`}>
          {imageProps ? (
            <Image
              src={imageProps.src}
              {...(post.mainImage.blurDataURL && {
                placeholder: "blur",
                blurDataURL: post.mainImage.blurDataURL
              })}
              alt={post.mainImage.alt || "Thumbnail"}
              priority={!!preloadImage}
              className="object-cover transition-all"
              fill
              sizes="(max-width: 768px) 30vw, 33vw"
            />
          ) : (
            <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-gray-200">
              <PhotoIcon />
            </span>
          )}
        </Link>
      </div>

      <div className={cx(minimal && "flex items-center")}>
        <div>
          <CategoryLabel categories={post.categories} nomargin={minimal} />
          <h2
            className={cx(
              fontSize === "large"
                ? "text-2xl"
                : minimal
                ? "text-3xl"
                : "text-lg",
              fontWeight === "normal"
                ? "line-clamp-2 font-medium tracking-normal text-black"
                : "font-semibold leading-snug tracking-tight",
              "mt-2 dark:text-white"
            )}>
            <Link href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${post?.slug?.current || ""}`}>
              <span className="bg-gradient-to-r from-[#EFF8FD] to-[#EFF8FD] bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_10px] dark:from-purple-800 dark:to-purple-900">
                {post.title}
              </span>
            </Link>
          </h2>

          <div className="hidden">
            {post.excerpt && (
              <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                <Link href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${post?.slug?.current || ""}`}>
                  {post.excerpt}
                </Link>
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center space-x-3 text-gray-500 dark:text-gray-400">
            {authorSlug && (
              <Link href={`/author/${authorSlug}`}>
                <div className="flex items-center gap-3">
                  <div className="relative h-5 w-5 flex-shrink-0">
                    {AuthorimageProps && (
                      <Image
                        src={AuthorimageProps.src}
                        alt={post?.author?.name || "Author"}
                        className="rounded-full object-cover"
                        fill
                        sizes="20px"
                      />
                    )}
                  </div>
                  <span className="truncate text-sm">{post?.author?.name}</span>
                </div>
              </Link>
            )}
            <span className="text-xs text-gray-300 dark:text-gray-600">&bull;</span>
            <time
              className="truncate text-sm"
              dateTime={post?.publishedAt || post._createdAt}>
              {format(parseISO(post?.publishedAt || post._createdAt), "MMMM dd, yyyy")}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
}
*/}




import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import { parseISO, format } from "date-fns";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CategoryLabel from "@/components/blog/category";


export default function PostList({
  post,
  aspect,
  minimal,
  pathPrefix,
  preloadImage,
  fontSize,
  fontWeight
}) {
  const imageProps = post?.mainImage ? urlForImage(post.mainImage) : null;
  const AuthorimageProps = post?.author?.image ? urlForImage(post.author.image) : null;
  const authorSlug = post?.author?.slug?.current;

  return (
        <div className="bg-white hover:bg-[#f3faff]  rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden p-6 max-w-sm transition-all hover:scale-105">
            <Link href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${post?.slug?.current || ""}`}>
              <div className="w-full h-[190px] relative rounded-lg overflow-hidden mb-3">
                {imageProps ? (
                  <Image
                    src={imageProps.src}
                    {...(post.mainImage.blurDataURL && {
                      placeholder: "blur",
                      blurDataURL: post.mainImage.blurDataURL
                    })}
                    alt={post.mainImage.alt || "Thumbnail"}
                    priority={!!preloadImage}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 30vw, 33vw"
                  />
                ) : (
                  <div className= " flex items-center justify-center h-full text-gray-300 bg-gray-100">
                    No Image
                  </div>
                )}
              </div>
            </Link>



      <div className="p-5">
        {/* Categories */}
        <div className="mb-3 flex flex-wrap gap-2">
          {post.categories?.map((cat, index) => (
          <Link
            key={index}
            href={`/category/${cat.slug?.current || ""}`}
            className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
          >
            {cat.title}
          </Link>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2">
          <Link href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${post?.slug?.current || ""}`}>
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-gray-700 line-clamp-3 mb-3">
          {post.excerpt || "No description available."}
        </p>

        {/* Author & Date */}
        <div className="flex items-center space-x-3 text-gray-500 text-sm">
          {authorSlug && (
            <Link href={`/author/${authorSlug}`} className="flex items-center gap-2">
              {AuthorimageProps && (
                <Image
                  src={AuthorimageProps.src}
                  alt={post?.author?.name || "Author"}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}
              <span>{post?.author?.name}</span>
            </Link>
          )}
          <span>&bull;</span>
          <time dateTime={post?.publishedAt || post._createdAt}>
            {format(parseISO(post?.publishedAt || post._createdAt), "MMMM dd, yyyy")}
          </time>
        </div>
      </div>
    </div>
  );
}


export const revalidate = 60;