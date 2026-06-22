import { Control, FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type SelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
};

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  disabled,
}: SelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps<T, FieldPath<T>> }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            value={field.value !== null && field.value !== undefined ? String(field.value) : ""} 
            onValueChange={(value) => {
              // Try to convert to number if the value is numeric
              const numValue = !isNaN(Number(value)) && value !== "" ? Number(value) : value;
              field.onChange(numValue);
            }} 
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
