export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: Rule => Rule.required().min(10).max(1000)
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: 'Comments won\'t show on the site until approved',
      initialValue: false
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ],
  preview: {
    select: {
      name: 'name',
      content: 'content',
      post: 'post.title'
    },
    prepare({ name, content, post }) {
      return {
        title: `${name} on ${post}`,
        subtitle: content
      }
    }
  }
} 