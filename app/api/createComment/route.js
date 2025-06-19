// app/api/createComment/route.js
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-19',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
};

const client = createClient(config);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, content, postId } = body;

    if (!name || !email || !content || !postId) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const result = await client.create({
      _type: 'comment',
      name,
      email,
      content,
      post: { _type: 'reference', _ref: postId },
      approved: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Comment submitted', result }, { status: 200 });
  } catch (err) {
    console.error('Sanity create error:', err);
    return NextResponse.json({ message: 'Error submitting comment', error: err.message }, { status: 500 });
  }
}