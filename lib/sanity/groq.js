import { groq } from "next-sanity";

// Get all posts
export const postquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) {
  _id,
  _createdAt,
  publishedAt,
  mainImage {
    ...,
    "blurDataURL":asset->metadata.lqip,
    "ImageColor": asset->metadata.palette.dominant.background,
  },
  featured,
  excerpt,
  slug,
  title,
  author-> {
    _id,
    image,
    slug,
    name
  },

  categories[]->,
  
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


}
`;
// Get all posts with 0..limit
export const limitquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [0..$limit] {
  ...,
  author->,
  categories[]->,
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
}
`;
// [(($pageIndex - 1) * 10)...$pageIndex * 10]{
// Get subsequent paginated posts
export const paginatedquery = groq`
*[_type == "post"] | order(publishedAt desc, _createdAt desc) [$pageIndex...$limit] {
  ...,
  author->,
  categories[]->,
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
}
`;

// Get Site Config
export const configQuery = groq`
*[_type == "settings"][0] {
  ...,
}
`;

// Single Post
export const singlequery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ...,
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        "slug": @.reference->slug
      }
    }
  },
  author->,
  categories[]->,
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
  },
  "estReadingTime": round(length(pt::text(body)) / 5 / 180 ),
  "related": *[_type == "post" && count(categories[@._ref in ^.^.categories[]._ref]) > 0 ] | order(publishedAt desc, _createdAt desc) [0...5] {
    title,
    slug,
    "date": coalesce(publishedAt,_createdAt),
    "image": mainImage
  },
}
`;

// Paths for generateStaticParams
export const pathquery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`;
export const catpathquery = groq`
*[_type == "category" && defined(slug.current)][].slug.current
`;
export const authorsquery = groq`
*[_type == "author" && defined(slug.current)][].slug.current
`;
export const sectorpathquery = groq`
*[_type == "sector" && defined(slug.current)][].slug.current
`;
export const characterpathquery = groq`
*[_type == "character" && defined(slug.current)][].slug.current
`;
export const topicpathquery = groq`
*[_type == "topic" && defined(slug.current)][].slug.current
`;

// Get Posts by Authors
export const postsbyauthorquery = groq`{
  "author": *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio,
    socialLinks
  },
  "posts": *[_type == "post" && $slug match author->slug.current ] {
    _id,
    _createdAt,
    publishedAt,
    mainImage {
      ...,
      "blurDataURL":asset->metadata.lqip,
      "ImageColor": asset->metadata.palette.dominant.background,
    },
    excerpt,
    slug,
    title,
    author-> {
      _id,
      image,
      slug,
      name
    },
    categories[]->,
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
  }
}`;

// Get Posts by Category
export const postsbycatquery = groq`
*[_type == "post" && $slug in categories[]->slug.current ] {
  ...,
  author->,
  categories[]->,
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
}
`;

// Get Posts by Sector
export const postsbysectorquery = groq`
*[_type == "post" && sector->slug.current == $slug ] {
  ...,
  author->,
  categories[]->,
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
}
`;

// Get Posts by Character
export const postsbycharacterquery = groq`
*[_type == "post" && character->slug.current == $slug ] {
  ...,
  author->,
  categories[]->,
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
}
`;

// Get Posts by Topic
export const postsbytopicquery = groq`
*[_type == "post" && topic->slug.current == $slug ] {
  ...,
  author->,
  categories[]->,
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
}
`;

// Get top 5 categories
export const catquery = groq`*[_type == "category"] {
  ...,
  "count": count(*[_type == "post" && references(^._id)])
} | order(count desc) [0...5]`;

export const searchquery = groq`*[_type == "post" && _score > 0]
| score(title match $query || excerpt match $query || pt::text(body) match $query)
| order(_score desc)
{
  _score,
  _id,
  _createdAt,
  mainImage,
  author->,
  categories[]->,
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
  },
   title,
   slug
}`;

// Get all Authors
export const allauthorsquery = groq`
*[_type == "author"] {
 ...,
 'slug': slug.current,
}
`;

// Get all Sectors
export const allsectorsquery = groq`
*[_type == "sector"] {
 ...,
 'slug': slug.current,
 'iconUrl': icon.asset->url,
}
`;

// Get all Characters
export const allcharactersquery = groq`
*[_type == "character"] {
 ...,
 'slug': slug.current,
 'iconUrl': icon.asset->url,
}
`;

// Get all Topics
export const alltopicsquery = groq`
*[_type == "topic"] {
 ...,
 'slug': slug.current,
 'iconUrl': icon.asset->url,
}
`;

// get everything from sanity
// to test connection
export const getAll = groq`*[]`;
