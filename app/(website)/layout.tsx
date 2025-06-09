import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footerl";
import { urlForImage } from "@/lib/sanity/image";
import Navbar from "@/components/navbarlurnex";
import { Inter, Merriweather } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const merriweather = Merriweather({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
})


async function sharedMetaData(params) {
  const settings = await getSettings();

  return {
    // enable this for resolving opengraph image
    // metadataBase: new URL(settings.url),
    title: {
      default:
        settings?.title ||
        "Stablo - Blog Template for Next.js & Sanity CMS",
      template: "%s | Stablo"
    },
    description:
      settings?.description ||
      "Stablo - popular open-source next.js and sanity blog template",
    keywords: ["Next.js", "Sanity", "Tailwind CSS"],
    authors: [{ name: "Surjith" }],
    canonical: settings?.url,
    openGraph: {
      images: [
        {
          url:
            urlForImage(settings?.openGraphImage)?.src ||
            "/img/opengraph.jpg",
          width: 800,
          height: 600
        }
      ]
    },
    twitter: {
      title: settings?.title || "Stablo Template",
      card: "summary_large_image"
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export async function generateMetadata({ params }) {
  return await sharedMetaData(params);
}

export default async function Layout({ children, params }) {
  const settings = await getSettings();
  return (
    <>
      <Navbar {...settings} />

      {children}

      <Footer {...settings} />
    </>
  );
}
// enable revalidate for all pages in this layout
export const revalidate = 60;
