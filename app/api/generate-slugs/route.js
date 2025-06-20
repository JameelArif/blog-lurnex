import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import slugify from 'slugify'

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, // You'll need a write token
  apiVersion: '2023-05-03',
  useCdn: false,
})

// Function to generate slug from label
function generateSlug(label) {
  return slugify(label, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

export async function POST() {
  try {
    // Get all sectors without slugs
    const sectors = await client.fetch(`
      *[_type == "sector" && !defined(slug.current)] {
        _id,
        label
      }
    `)

    // Get all characters without slugs
    const characters = await client.fetch(`
      *[_type == "character" && !defined(slug.current)] {
        _id,
        label
      }
    `)

    // Get all topics without slugs
    const topics = await client.fetch(`
      *[_type == "topic" && !defined(slug.current)] {
        _id,
        label
      }
    `)

    const results = []

    // Update sectors
    for (const sector of sectors) {
      const slug = generateSlug(sector.label)
      await client.patch(sector._id).set({
        slug: {
          _type: 'slug',
          current: slug
        }
      }).commit()
      results.push(`Updated sector "${sector.label}" with slug: ${slug}`)
    }

    // Update characters
    for (const character of characters) {
      const slug = generateSlug(character.label)
      await client.patch(character._id).set({
        slug: {
          _type: 'slug',
          current: slug
        }
      }).commit()
      results.push(`Updated character "${character.label}" with slug: ${slug}`)
    }

    // Update topics
    for (const topic of topics) {
      const slug = generateSlug(topic.label)
      await client.patch(topic._id).set({
        slug: {
          _type: 'slug',
          current: slug
        }
      }).commit()
      results.push(`Updated topic "${topic.label}" with slug: ${slug}`)
    }

    return NextResponse.json({
      success: true,
      message: 'All documents updated successfully!',
      results,
      summary: {
        sectors: sectors.length,
        characters: characters.length,
        topics: topics.length
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 