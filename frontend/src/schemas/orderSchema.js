import { z } from 'zod';

export const orderSchema = z.object({
  mockupId: z.string().min(1, 'Mockup is required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  notes: z.string().max(500).optional(),
});
