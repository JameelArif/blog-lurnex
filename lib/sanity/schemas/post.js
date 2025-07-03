export default {
  name: "post",
  title: "Post",
  type: "document",
  initialValue: () => ({
    publishedAt: new Date().toISOString()
  }),
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string"
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      }
    },
    {
      name: "excerpt",
      title: "Excerpt",
      description:
        "The excerpt is used in blog feeds, and also for search results",
      type: "text",
      rows: 3,
      validation: Rule => Rule.max(200)
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" }
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      fields: [
        // {
        //   name: "caption",
        //   type: "string",
        //   title: "Image caption",
        //   description: "Appears below image.",

        // },
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity."
        }
      ],
      options: {
        hotspot: true
      }
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }]
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime"
    },
    {
      name: "featured",
      title: "Mark as Featured",
      type: "boolean"
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    },
    {
      name: 'sector',
      title: 'Sector',
      type: 'reference',
      to: [{ type: 'sector' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'character',
      title: 'Character',
      type: 'reference',
      to: [{ type: 'character' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'topic',
      title: 'Topic',
      type: 'reference',
      to: [{ type: 'topic' }],
      validation: Rule => Rule.required()
    },

    {
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {
        accept: 'video/*'
      }
    },
    {
      name: 'videoUrl',
      title: 'Video URL (YouTube, Vimeo, etc.)',
      type: 'url',
      description: 'Paste a YouTube, Vimeo, or other video link here to embed it in your post.'
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        { name: 'title', title: 'Meta Title', type: 'string', description: 'Overrides the main post title for SEO.' },
        { name: 'description', title: 'Meta Description', type: 'text', description: 'Overrides the main post excerpt for SEO.' },
        { name: 'image', title: 'Social Image', type: 'image', description: 'Overrides the main post image for social sharing.' },
        { name: 'noindex', title: 'No Index', type: 'boolean', initialValue: false, description: 'Prevent search engines from indexing this page.' }
      ]
    }
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage"
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      });
    }
  }
};
