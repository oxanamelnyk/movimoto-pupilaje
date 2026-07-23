"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  ControllerRenderProps,
} from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ComboboxFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  fetchUrl?: string;
  options?: Array<{ value: string; label: string }>;
  onCreateNew?: (
    value: string,
  ) => Promise<{ id: number | string; name: string } | null> | void;
  disabled?: boolean;
};

export function ComboboxField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  fetchUrl,
  options: initialOptions,
  onCreateNew,
  disabled,
}: ComboboxFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >(initialOptions || []);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const optionsToUse = useMemo(
    () => initialOptions || options,
    [initialOptions, options],
  );

  useEffect(() => {
    // If options are provided directly, skip fetching
    if (initialOptions) {
      return;
    }

    // Otherwise, fetch from fetchUrl
    const fetchOptions = async () => {
      if (!fetchUrl) return;

      setLoading(true);
      try {
        const response = await fetch(fetchUrl);
        if (response.ok) {
          const data = await response.json();
          setOptions(data);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchOptions();
    }
  }, [open, fetchUrl, initialOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const filteredOptions = optionsToUse.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const hasExactMatch = filteredOptions.some(
    (option) => option.label.toLowerCase() === searchValue.toLowerCase(),
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<T, FieldPath<T>>;
      }) => {
        // Find the label for the current selected value
        const selectedLabel =
          optionsToUse.find((option) => option.value === String(field.value))
            ?.label || "";

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <div className="relative" ref={containerRef}>
              <div className="relative">
                <Input
                  placeholder={placeholder || "Buscar..."}
                  value={searchValue || (open ? "" : selectedLabel || "")}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    if (!open) setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  disabled={disabled || loading}
                  className="pr-8"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => {
                    if (field.value) {
                      field.onChange("");
                      setSearchValue("");
                    } else {
                      setOpen(!open);
                    }
                  }}
                  disabled={disabled || loading}>
                  {field.value ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  )}
                </Button>
              </div>

              {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-input rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Cargando...
                    </div>
                  ) : filteredOptions.length > 0 ? (
                    <>
                      {filteredOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            // Convert to number if the value is numeric
                            const numValue =
                              !isNaN(Number(option.value)) &&
                              option.value !== ""
                                ? Number(option.value)
                                : option.value;
                            field.onChange(numValue);
                            setOpen(false);
                            setSearchValue("");
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center gap-2",
                            (field.value === option.value ||
                              String(field.value) === option.value) &&
                              "bg-accent",
                          )}>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              field.value === option.value ||
                                String(field.value) === option.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {option.label}
                        </button>
                      ))}
                      {searchValue && !hasExactMatch && (
                        <button
                          type="button"
                          onClick={async () => {
                            if (onCreateNew) {
                              const result = await onCreateNew(searchValue);
                              // If a new item was created with an ID, set it to the field
                              if (result && result.id) {
                                const numValue = Number(result.id);
                                // Optimistically add to options so it shows up immediately
                                const newOption = {
                                  value: String(result.id),
                                  label: result.name || searchValue,
                                };
                                setOptions((prev) => [...prev, newOption]);
                                field.onChange(numValue);
                              }
                            }
                            setOpen(false);
                            setSearchValue("");
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 border-t">
                          <Plus className="h-4 w-4" />
                          Crear nuevo: &quot;{searchValue}&quot;
                        </button>
                      )}
                    </>
                  ) : searchValue && !hasExactMatch ? (
                    <button
                      type="button"
                      onClick={async () => {
                        if (onCreateNew) {
                          const result = await onCreateNew(searchValue);
                          // If a new item was created with an ID, set it to the field
                          if (result && result.id) {
                            const numValue = Number(result.id);
                            // Optimistically add to options so it shows up immediately
                            const newOption = {
                              value: String(result.id),
                              label: result.name || searchValue,
                            };
                            setOptions((prev) => [...prev, newOption]);
                            field.onChange(numValue);
                          }
                        }
                        setOpen(false);
                        setSearchValue("");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600">
                      <Plus className="h-4 w-4" />
                      Crear nuevo: &quot;{searchValue}&quot;
                    </button>
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No hay opciones disponibles
                    </div>
                  )}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
