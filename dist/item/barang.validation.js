"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsValidation = void 0;
const zod_1 = require("zod");
var Category;
(function (Category) {
    Category["Tshirt"] = "Tshirt";
    Category["Hoodies"] = "Hoodies";
    Category["Streetwear"] = "Streetwear";
    Category["Luxury"] = "Luxury";
    Category["Jackets"] = "Jackets";
    Category["Sweatshirts"] = "Sweatshirts";
})(Category || (Category = {}));
class ItemsValidation {
    static CREATE = zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        image: zod_1.z.string().url("Image must be a valid URL"),
        description: zod_1.z.string().min(1, "Description is required"),
        rating: zod_1.z.number().min(0, "Rating must be at least 0").max(5, "Rating must be at most 5").optional(),
        isHot: zod_1.z.boolean().optional(),
        isNew: zod_1.z.boolean().optional(),
        isFeatured: zod_1.z.boolean().optional(),
        price: zod_1.z.number().min(0, "Price must be at least 0").optional(),
        stock: zod_1.z.number().min(0, "Stock must be at least 0").optional(),
        type: zod_1.z.nativeEnum(Category, {
            errorMap: () => ({ message: "Invalid category type" }),
        }),
    });
    static UPDATE = zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid ID format"),
        name: zod_1.z.string().min(1, "Name is required").optional(),
        image: zod_1.z.string().url("Image must be a valid URL").optional(),
        description: zod_1.z.string().min(1, "Description is required").optional(),
        rating: zod_1.z.number().min(0, "Rating must be at least 0").max(5, "Rating must be at most 5").optional(),
        isHot: zod_1.z.boolean().optional(),
        isNew: zod_1.z.boolean().optional(),
        isFeatured: zod_1.z.boolean().optional(),
        price: zod_1.z.number().min(0, "Price must be at least 0").optional(),
        stock: zod_1.z.number().min(0, "Stock must be at least 0").optional(),
        type: zod_1.z.nativeEnum(Category, {
            errorMap: () => ({ message: "Invalid category type" }),
        }).optional(),
    });
}
exports.ItemsValidation = ItemsValidation;
//# sourceMappingURL=barang.validation.js.map