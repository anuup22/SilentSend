import { z } from 'zod';

export const messageSchema = z.object({
    message: z
    .string()
    .min(1, { message: "Message must not be empty" })
    .max(300, { message: "Message must be at most 300 characters" })
});