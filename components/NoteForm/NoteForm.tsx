'use client'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as Yup from 'yup'
import { createNote } from '@/lib/api/notes'
import { NOTE_TAGS, type NoteTag } from '@/types/note'
import css from './NoteForm.module.css'

interface NoteFormProps {
  onCancel: () => void
}

interface NoteFormValues {
  title: string
  content: string
  tag: NoteTag
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(50, 'Maximum 50 characters')
    .required('Required'),
  content: Yup.string().max(500, 'Maximum 500 characters'),
  tag: Yup.mixed<NoteTag>().oneOf(NOTE_TAGS).required('Required'),
})

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient()
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      onCancel()
    },
  })

  const handleSubmit = async (values: NoteFormValues) => {
    await createNoteMutation.mutateAsync(values)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            {NOTE_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={createNoteMutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  )
}
