import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Add Product" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">Add Product</h1>
      <ProductForm />
    </div>
  );
}
