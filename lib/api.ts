import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { Note, NoteTag } from '@/types/note'

const API_URL = 'https://notehub-public.goit.study/api'

const notehubApi = axios.create({
  baseURL: API_URL,
})

const getToken = () => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN

  if (!token) {
    throw new Error('Missing NEXT_PUBLIC_NOTEHUB_TOKEN environment variable')
  }

  return token
}

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
})

export interface FetchNotesParams {
  page: number
  perPage: number
  search?: string
}

export interface FetchNotesResponse {
  notes: Note[]
  totalPages: number
}

export interface CreateNotePayload {
  title: string
  content: string
  tag: NoteTag
}

export interface DeleteNoteResponse {
  id: string
  title: string
  content: string
  tag: NoteTag
  createdAt: string
  updatedAt: string
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> =
    await notehubApi.get<FetchNotesResponse>('/notes', {
      headers: getHeaders(),
      params: {
        page,
        perPage,
        ...(search ? { search } : {}),
      },
    })

  return response.data
}

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.get<Note>(
    `/notes/${id}`,
    {
      headers: getHeaders(),
    }
  )

  return response.data
}

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.post<Note>(
    '/notes',
    payload,
    {
      headers: getHeaders(),
    }
  )

  return response.data
}

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> =
    await notehubApi.delete<DeleteNoteResponse>(`/notes/${id}`, {
      headers: getHeaders(),
    })

  return response.data
}
