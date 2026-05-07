"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/db/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

function formatDateForDisplay(dateString: string | undefined) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function formatDateForValue(date: Date | undefined): string {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(() => {
    if (!value) return new Date();
    try {
      return new Date(value);
    } catch {
      return new Date();
    }
  });

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    try {
      return new Date(value);
    } catch {
      return undefined;
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatDateForDisplay(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          month={month}
          onMonthChange={setMonth}
          onSelect={(date) => {
            if (date) {
              onChange(formatDateForValue(date));
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
