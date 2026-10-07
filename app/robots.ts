import type { MetadataRoute } from 'next'

/** The door is public. Everything behind it is not for search engines. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/f/',
        '/team',
        '/api/',
        '/lab',
        '/arrive',
        '/archetype',
        '/profile',
        '/challenge',
        '/research',
        '/today',
        '/plan',
        '/stops',
        '/messages',
        '/pod',
      ],
    },
  }
}
