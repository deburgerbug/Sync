import { z } from 'zod'

export const createListSchema = z.object({
    title: z.string().min(2, 'List tile must be at least 2 characters'),
    boardId: z.string().uuid('Invalid Board Id')
})