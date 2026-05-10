import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Briefcase } from "lucide-react";
import { COMPREHENSIVE_CAREERS, CareerCatalogEntry } from "@/data/careersCatalog";

export function CareersCatalogView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCareers = COMPREHENSIVE_CAREERS.filter((career: CareerCatalogEntry) => 
    career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Careers Catalog</h2>
        <p className="text-muted-foreground">Read-only view of the standardized career database.</p>
      </div>

      <Card className="shadow-sm border-border/50 bg-card/50">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Active Careers ({COMPREHENSIVE_CAREERS.length})
            </CardTitle>
            <CardDescription>All careers currently available in the system</CardDescription>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search careers..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">Career Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Demand</TableHead>
                  <TableHead className="text-right">Education/Pathway</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCareers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                      No careers found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCareers.map((career: CareerCatalogEntry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{career.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          {career.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${career.demand.includes('High') ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {career.demand}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {career.education}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
