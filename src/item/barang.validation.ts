import { z, ZodType } from "zod";


enum Category {
  Tshirt = "Tshirt",
  Hoodies = "Hoodies",
  Streetwear = "Streetwear",
  Luxury = "Luxury",
  Jackets = "Jackets",
  Sweatshirts = "Sweatshirts",
}

export class ItemsValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.string().url("Image must be a valid URL"),
    description: z.string().min(1, "Description is required"),
    rating: z.number().min(0, "Rating must be at least 0").max(5, "Rating must be at most 5").optional(),
    isHot: z.boolean().optional(),
    isNew: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    price: z.number().min(0, "Price must be at least 0").optional(),
    stock: z.number().min(0, "Stock must be at least 0").optional(),
    type: z.nativeEnum(Category, {
      errorMap: () => ({ message: "Invalid category type" }),
    }),
  })

  static readonly UPDATE: ZodType = z.object({
    id: z.string().uuid("Invalid ID format"),
    name: z.string().min(1, "Name is required").optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    description: z.string().min(1, "Description is required").optional(),
    rating: z.number().min(0, "Rating must be at least 0").max(5, "Rating must be at most 5").optional(),
    isHot: z.boolean().optional(),
    isNew: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    price: z.number().min(0, "Price must be at least 0").optional(),
    stock: z.number().min(0, "Stock must be at least 0").optional(),
    type: z.nativeEnum(Category, {
      errorMap: () => ({ message: "Invalid category type" }),
    }).optional(),
  })
}
