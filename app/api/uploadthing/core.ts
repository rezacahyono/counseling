import { getServerSession } from 'next-auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const getUser = async () => await getServerSession()

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async req => {
      // This code runs on your server before upload
      const session = await getUser()

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new Error('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { email: session.user.email }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for email:', metadata.email)

      console.log('file url', file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

