import NotePreviewClient from './NotePreview.client'

interface NotePreviewModalPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NotePreviewModalPage({
  params,
}: NotePreviewModalPageProps) {
  const { id } = await params

  return <NotePreviewClient id={id} />
}
