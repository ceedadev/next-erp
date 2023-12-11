import PaginationControl from "@/components/pagination-control";
import { Sheet } from "@/components/sheet";

const DUMMY_DATA = [
  "Product 1",
  "Product 2",
  "Product 3",
  "Product 4",
  "Product 5",
  "Product 6",
  "Product 7",
  "Product 8",
  "Product 9",
  "Product 10",
  "Product 11",
  "Product 12",
  "Product 13",
  "Product 14",
  "Product 15",
];

export default function ProductPage({
  searchParams,
}: {
  searchParams: {
    page: number;
    perPage: number;
  };
}) {
  const page = searchParams.page ?? 1;
  const perPage = searchParams.perPage ?? 5;

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const entries = DUMMY_DATA.slice(start, end);

  return (
    <Sheet>
      <p>Product Page</p>
      <div className="flex flex-col space-y-4">
        {entries.map((entry) => (
          <div
            key={entry}
            className="flex flex-row justify-between items-center px-4 py-2 bg-white rounded-md shadow-md"
          >
            <p>{entry}</p>
          </div>
        ))}
        <PaginationControl
          hasNextPage={end < DUMMY_DATA.length}
          hasPrevPage={start > 0}
        />
      </div>
    </Sheet>
  );
}
