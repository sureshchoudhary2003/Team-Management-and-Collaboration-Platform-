import { Input } from "../../../ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import { Button } from "../../../ui/button";
import { ChevronDown } from "lucide-react";

// Minimal toolbar showing column visibility toggle and optional custom filters
// Props:
//  - table: react-table instance
//  - filtersToolbar: React node (optional) rendered on the right side
export const DataTableToolbar = ({ table, filtersToolbar }) => {
  if (!table) return null;

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      {/* Global Filter (search) */}
      <Input
        placeholder="Search..."
        value={table.getState().globalFilter ?? ""}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="h-8 w-[150px] lg:w-[250px]"
      />

      <div className="flex items-center gap-2">
        {filtersToolbar}
        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-8">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {table.getAllLeafColumns().map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}; 