import { createNextRouteHandler } from 'uploadthing/next'

import { ourFileRouter } from './core'

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: '0mm7e1egij',
    uploadthingSecret:
      'sk_live_f2ad5c0e95e7eea7e3f250960d186f3e97324f06dc9c0d017d5b7fdd47c2dd89',
  },
})

