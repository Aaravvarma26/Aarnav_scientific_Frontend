import { Skeleton } from "@/components/common/skeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-px mx-auto max-w-[1600px] py-14">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="mt-4 h-10 w-96 max-w-full" />
          <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
          <Skeleton className="mt-8 h-14 w-full max-w-2xl rounded-full" />
        </div>
      </div>

      <div className="container-px mx-auto max-w-[1600px] py-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <Skeleton className="h-[420px] w-full rounded-[20px]" />

          <div>
            <Skeleton className="mb-6 h-5 w-56" />
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)]">
      <Skeleton className="h-[240px] w-full rounded-none" />
      <div className="p-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-2/3" />
        <Skeleton className="mt-4 h-4 w-32" />
        <Skeleton className="mt-1.5 h-4 w-24" />
        <div className="mt-5 flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}