import PaginationControl from "@/components/pagination-control";
import { Sheet } from "@/components/sheet";
import { db } from "@/db/connect";
import { products } from "@/db/schema";
import { asc, sql } from "drizzle-orm";

export default async function ProductPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    perPage: number;
    sort: [string, "asc" | "desc"];
  };
}) {
  const page = Number(searchParams.page ?? 1);
  const perPage = searchParams.perPage ?? 5;
  const offset = (page - 1) * perPage;

  const allProducts = await db
    .select()
    .from(products)
    .orderBy(asc(products.name))
    .limit(perPage)
    .offset(offset);

  const totalProducts = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);

  const numberOfPages = Math.ceil(totalProducts[0].count / perPage);

  return (
    <Sheet>
      <p>Product Page</p>
      <p>{JSON.stringify(allProducts)}</p>
      <p>{JSON.stringify(totalProducts)}</p>
      <p>{numberOfPages}</p>
      <div className="flex flex-col space-y-4">
        {allProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-row justify-between items-center px-4 py-2 bg-white rounded-md shadow-md"
          >
            <p>{product.name}</p>
          </div>
        ))}
        <PaginationControl
          totalPages={numberOfPages}
          hasNextPage={page < numberOfPages}
          hasPrevPage={page > 1}
        />
      </div>
    </Sheet>
  );
}
