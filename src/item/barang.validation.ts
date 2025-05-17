import { z, ZodType } from "zod";

const baseSchema = z.object({
  type: z.enum(['books', 'final_projects', 'tools']),
  name: z.string().min(1).max(100),
  price: z.number().min(0),
  stock: z.number().min(0),
  description: z.string().min(1).max(1000),
  image: z.string().url(),
  writer: z.string().min(1).max(100).optional(),
});

export class ItemsValidation {
  static readonly CREATE: ZodType = baseSchema.superRefine((data, ctx) => {
    if (data.type === 'books' && !data.writer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Writer is required when type is books',
        path: ['writer'],
      });
    }
  });

  static readonly UPDATE: ZodType = z.object({
    type: z.enum(['books', 'final_projects', 'tools']).optional(),
    name: z.string().min(1).max(100).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().min(0).optional(),
    description: z.string().min(1).max(1000).optional(),
    image: z.string().url().optional(),
    writer: z.string().min(1).max(100).optional(),
  });
}
