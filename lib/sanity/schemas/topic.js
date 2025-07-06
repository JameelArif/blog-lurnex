export default {
  name: 'topic',
  title: 'Topic',
  type: 'document',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() },
    { name: 'icon', title: 'Icon', type: 'image', validation: Rule => Rule.required() },
    { name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true }, description: 'Large hero image for topic page.' },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "label",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', title: 'Meta Title', type: 'string' },
        { name: 'description', title: 'Meta Description', type: 'text' },
        { name: 'image', title: 'Social Image', type: 'image' },
        { name: 'noindex', title: 'No Index', type: 'boolean', initialValue: false }
      ]
    }
  ]
}
