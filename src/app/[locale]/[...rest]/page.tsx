import { notFound } from 'next/navigation'

/** Any URL matching no real route under a locale renders the branded 404. */
export default function CatchAll() {
  notFound()
}
