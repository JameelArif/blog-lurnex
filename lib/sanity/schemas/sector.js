export default {
    name: 'sector',
    title: 'Sector',
    type: 'document',
    fields: [
      { name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() },
      { name: 'icon', title: 'Icon', type: 'image', validation: Rule => Rule.required() }
    ]
  }