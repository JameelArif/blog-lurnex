export default {
  name: 'topic',
  title: 'Topic',
  type: 'document',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() },
    { name: 'icon', title: 'Icon', type: 'image', validation: Rule => Rule.required() },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "label",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }
  ]
}
