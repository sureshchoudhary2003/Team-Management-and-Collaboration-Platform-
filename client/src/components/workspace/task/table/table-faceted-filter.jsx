import * as React from "react";
import { Check, PlusCircle } from "lucide-react";

import { cn } from "../../../../lib/utils";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/popover";
import { Separator } from "../../../ui/separator";

// props:
// title: string
// options: Array<{ label: string; value: any; icon?: React.ComponentType<any> }>
// selectedValues: any[]
// disabled: boolean
// multiSelect: boolean (default true)
// onFilterChange: (values: any[]) => void

export function DataTableFacetedFilter({
  title,
  options = [],
  selectedValues = [],
  disabled = false,
  multiSelect = true,
  onFilterChange,
}) {
  const selectedValueSet = React.useMemo(() => new Set(selectedValues), [selectedValues]);
  const [open, setOpen] = React.useState(false);

  const toggleValue = (value) => {
    if (!onFilterChange) return;

    if (multiSelect) {
      const newValues = selectedValueSet.has(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onFilterChange(newValues);
    } else {
      const newValues = selectedValueSet.has(value) ? [] : [value];
      onFilterChange(newValues);
      setOpen(false);
    }
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size="sm"
          className="h-8 border-dashed w-full lg:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="mr-2">{title}</span>
          {selectedValueSet.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValueSet.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValueSet.size > 1 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValueSet.size}
                  </Badge>
                ) : (
                  options
                    .filter((opt) => selectedValueSet.has(opt.value))
                    .map((opt) => (
                      <Badge key={opt.value} variant="secondary" className="rounded-sm px-1 font-normal">
                        {opt.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Filter ${title}`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValueSet.has(option.value);
                const Icon = option.icon;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleValue(option.value)}
                    className="cursor-pointer"
                  >
                    {multiSelect && (
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValueSet.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup className="sticky bottom-0 bg-white">
                  <CommandItem onSelect={() => onFilterChange([])} className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
