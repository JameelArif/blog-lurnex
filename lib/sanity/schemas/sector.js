export default {
    name: 'sector',
    title: 'Sector',
    type: 'document',
    fields: [
      { name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() },
      { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'label', maxLength: 96 }, validation: Rule => Rule.required() },
      { name: 'blockImage', title: 'Block Image', type: 'image', validation: Rule => Rule.required(), description: 'Landscape image for sector block on homepage.' },
      { name: 'heroImage', title: 'Hero Image', type: 'image', description: 'Large hero image for sector page.' },
      { name: 'icon', title: 'Icon', type: 'image', description: 'Optional small icon for sector.' },
      { name: 'description', title: 'Description', type: 'text', rows: 2, description: 'Short description for sector block and hero.' },
    ]
  }