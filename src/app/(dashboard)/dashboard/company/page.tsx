import Link from "next/link";

import { getAllCompanies } from "@/app/_actions/company";
import { Sheet } from "@/components/sheet";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function CompaniesPage() {
  const companies = await getAllCompanies();

  return (
    <Sheet>
      <Breadcrumbs
        segments={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Companies", href: "/dashboard/company" },
        ]}
      />
      
      <div className="flex flex-row w-full justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">
            View and manage registered companies in the system.
          </p>
        </div>
      </div>

      <div className="overflow-auto border rounded-md shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length > 0 ? (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{company.name}</span>
                      {company.website && (
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:underline"
                        >
                          {company.website}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>
                    {company.industry ? (
                      <Badge variant="secondary" className="capitalize">
                        {company.industry}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.size ? (
                      <Badge variant="outline" className="capitalize">
                        {company.size}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.city && company.country ? (
                      `${company.city}, ${company.country}`
                    ) : company.country ? (
                      company.country
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.isActive ? "default" : "destructive"}>
                      {company.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {company.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="space-y-2">
                    <p>No companies found.</p>
                    <p className="text-sm text-muted-foreground">
                      Companies are registered during the initial setup process.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Sheet>
  );
}