import { ImageResponse } from '@vercel/og';
import { getPostBySlug } from '@/lib/sanity/client';

export const runtime = 'edge';

const font = fetch(
  new URL('/fonts/Inter-Bold.otf', import.meta.url)
).then(res => res.arrayBuffer());

const logoUrl = 'https://blog.lurnex.net/logo.png'; 

export default async function handler(req, { params }) {
  const post = await getPostBySlug(params.slug);
  const fontData = await font;
  if (!post) {
    return new ImageResponse(
      <div tw="w-full h-full flex items-center justify-center bg-white text-3xl font-bold text-gray-800">Post Not Found</div>,
      { width: 1200, height: 630 }
    );
  }

  const category = post.categories?.[0]?.title || 'Blog';
  const author = post.author?.name || 'Lurnex';
  const title = post.title;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#00B6E6',
        padding: '60px 80px',
        fontFamily: 'Inter',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
        <img src={logoUrl} width={80} height={80} style={{ borderRadius: 16, marginRight: 32 }} />
        <span style={{ color: '#fff', fontSize: 32, fontWeight: 700, letterSpacing: 2 }}>Lurnex Blog</span>
      </div>
      <span style={{ color: '#fff', fontSize: 24, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24 }}>{category}</span>
      <h1 style={{ color: '#fff', fontSize: 60, fontWeight: 800, lineHeight: 1.1, marginBottom: 32, maxWidth: 900 }}>{title}</h1>
      <div style={{ color: '#fff', fontSize: 28, fontWeight: 400, marginTop: 'auto' }}>By {author}</div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );
} 

export async function generateMetadata({ params }) {
  // ...fetch post
  return {
    openGraph: {
      images: [`/post/${params.slug}/opengraph-image`],
    },
    // ...other metadata
  }
} 