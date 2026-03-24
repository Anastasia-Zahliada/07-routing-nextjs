import NotePreviewModal from '@/components/NotePreview/NotePreviewModal'

interface NotePreviewModalPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NotePreviewModalPage({
  params,
}: NotePreviewModalPageProps) {
  const { id } = await params

  return <NotePreviewModal id={id} />
}
