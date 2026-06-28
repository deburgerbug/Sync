import { z } from 'zod'

export const createBoardSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    workspaceId: z.string().uuid('Invalid workspace ID')
})

