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

    

        <div className="bg-white hover:bg-[#f3faff]  rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden p-6 max-w-sm transition-all duration-300 hover:scale-105">
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
        <div className="mb-2 flex flex-wrap gap-1.5">
          {post.categories?.map((cat, index) => (
            <Link
              key={index}
              href={`/category/${cat.slug?.current || ""}`}
              className="inline-flex items-center justify-center font-medium px-1.5 py-0.5 text-[9px] bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full transition-all duration-300 sm:text-[10px] md:text-[11px] lg:text-xs"
            >
              {cat.title}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-2 line-clamp-1">
          <Link href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${post?.slug?.current || ""}`}>
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-gray-700 line-clamp-1 mb-3">
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
            {(() => {
              try {
                const dateString = post?.publishedAt || post._createdAt;
                if (!dateString) return "Unknown date";
                const date = parseISO(dateString);
                if (isNaN(date.getTime())) return "Invalid date";
                return format(date, "MMMM dd, yyyy");
              } catch (error) {
                return "Invalid date";
              }
            })()}
          </time>
        </div>

        <div className="flex justify-left gap-4 mt-4">
          {[
            { item: post.sector, type: "sector" },
            { item: post.character, type: "character" },
            { item: post.topic, type: "topic" }
          ].map(({ item, type }, idx) =>
            item && item.slug && item.iconUrl ? (
              <Link
                key={idx}
                href={`/${type}/${item.slug}`}
                title={item.label}
                className="group flex flex-col items-center transition-transform hover:scale-110"
                style={{ minWidth: 48 }}
              >
                <img
                  src={item.iconUrl}
                  alt={item.label}
                  className="w-8 h-8 rounded-full shadow-md border border-gray-200 bg-white group-hover:border-blue-400 transition"
                  style={{ objectFit: "contain" }}
                />
              </Link>
            ) : null
          )}
        </div>
      </div>









    </div>



  );
}


export const revalidate = 60;