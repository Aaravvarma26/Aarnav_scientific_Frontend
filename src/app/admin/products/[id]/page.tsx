import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Edit Product" };

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">Edit Product</h1>
      <ProductForm productId={params.id} />
    </div>
  );
}
