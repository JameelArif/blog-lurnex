import { getSettings } from "@/lib/sanity/client";
import Footer from "@/components/footerl";
import { urlForImage } from "@/lib/sanity/image";
import Navbar from "@/components/navbarlurnex";
import { Inter, Merriweather } from 'next/font/google'
import { GoogleTagManagerNoScript } from "@/components/GoogleTagManager";

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
    metadataBase: settings.url ? new URL(settings.url) : undefined,
    title: {
      default:
        settings?.title ||
        "Lurnex: Business Architecture, Learning Platform & AI Mentors",
      template: `%s | ${settings?.title || "Lurnex"}`
    },
    description:
      settings?.description ||
      "Lurnex helps businesses thrive with real-world learning, AI-powered mentors, and practical tools. Discover our proven system for clarity, momentum, and lasting change.",
    keywords: ["technology solutions", "business insights", "web development", "software engineering", "digital transformation", "Lurnex", "business growth", "innovation"],
    authors: [{ name: "Jameel Arif" }],
    canonical: settings?.url,
    openGraph: {
      url: settings.url,
      siteName: settings.title || "Lurnex Blog",
      type: "website",
      title: settings?.title || "Lurnex Blog - Technology Solutions & Business Insights",
      description: settings?.description || "Discover cutting-edge technology solutions, business insights, and industry expertise from Lurnex.",
      images: [
        {
          url:
            urlForImage(settings?.openGraphImage)?.src ||
            "/img/opengraph.jpg",
          width: 800,
          height: 600,
          alt: "Lurnex Blog - Technology Solutions & Business Insights"
        }
      ]
    },
    twitter: {
      title: settings?.title || "Lurnex Blog - Technology Solutions & Business Insights",
      description: settings?.description || "Discover cutting-edge technology solutions, business insights, and industry expertise from Lurnex.",
      card: "summary_large_image",
      site: `@${settings?.twitter}`,
      creator: `@${settings?.twitter}`,
      images: [
        urlForImage(settings?.openGraphImage)?.src ||
        "/img/opengraph.jpg"
      ]
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
      <GoogleTagManagerNoScript />
      <Navbar {...settings} />

      {children}

      <Footer {...settings} />
    </>
  );
}
// enable revalidate for all pages in this layout
export const revalidate = 60;
