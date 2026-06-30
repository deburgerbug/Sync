import { z } from 'zod'

export const createCardSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters !'),
    description: z.string().min(2,'Description must be at least 2 characters').optional(),
    listId: z.string().uuid('Invalid list id')
})
