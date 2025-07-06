import Link from "next/link";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import SectorList from "@/components/blog/sectorList";
import Image from "next/image";

export default function HomePage({ posts, sectors }) {
  // Only show the latest 3 posts
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      {/* Hero Banner */}
      <div className="relative w-full bg-[#2DA9E1] shadow-lg overflow-hidden">
        <div className="relative w-full h-48 md:h-64 lg:h-80 xl:h-96">
          <Image
            src="/img/top.png"
            alt="Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col justify-center">
            <Container>
              <h1 className="text-white drop-shadow-2xl md:leading-tight text-4xl md:text-5xl font-extrabold">
                <span className="drop-shadow-2xl">Discover our</span>
                <br />
                <span className="drop-shadow-2xl">stories and insights</span>
              </h1>
            </Container>
          </div>
        </div>
      </div>

      

      {/* Sectors Section (new grid) */}   {/* Sectors Section */}
      <SectorList sectors={sectors} />

<Container>
  {/* Latest Posts Section */}
  <section aria-label="Latest Posts" className="mb-12">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center tracking-tight">
      Latest Posts
    </h2>
    <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
      Stay updated with our latest insights, tutorials, and industry analysis. 
      Our expert team shares valuable knowledge to help you stay ahead in the rapidly evolving tech landscape.
    </p>
    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-16">
      {latestPosts.map(post => (
        <PostList key={post._id} post={post} aspect="rectangle" />
      ))}
    </div>
    <div className="text-center mt-8">
      <Link 
        href="/archive" 
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        View All Posts
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </section>

  {/* Call to Action */}
  <section className="py-12 bg-gray-50 rounded-2xl mb-12">
    <div className="text-center max-w-3xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Ready to Transform Your Business?
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Let's discuss how our technology solutions can help your organization achieve its goals. 
        Our team of experts is ready to partner with you on your digital transformation journey.
      </p>



      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/contact" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get in Touch
        </Link>
        <Link 
          href="/about" 
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Learn More About Us
        </Link>
      </div>
      
    </div>
  </section>
</Container>

      {/* Lurnex Brand Section for SEO */}
      <Container>
        <section className="py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Business Architecture for Modern Teams
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At Lurnex, we’re not just consultants we’re business architects. Our platform helps you shape up your business with engaging, real-world learning and practical tools. Our proven system and interactive platform keep learning active, relevant, and woven into daily work, saving you time, money, and frustration.
            </p>
  
            <blockquote className="mt-8 italic text-blue-700 border-l-4 border-blue-300 pl-4">
              “There’s a clarity that we have now around the direction we’re going in, what we need to do. We feel empowered and enabled to overcome any problems.”<br/>
              <span className="font-semibold"> Charles Moore, Managing Director, Nurture Vet Hospital</span>
            </blockquote>
            <div className="mt-8">
              <a href="https://www.lurnex.net/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                Learn more about our business architecture and learning platform at Lurnex.net
              </a>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Get in Touch
              </a>
              <a href="/about" className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Learn More About Us
              </a>
            </div>
          </div>
        </section>
      </Container>
</>
);
}