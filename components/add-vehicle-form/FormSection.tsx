import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  icon?: string;
}

export function FormSection({ title, children, icon }: FormSectionProps) {
  return (
    <Card className="overflow-visible border-0 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-4">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>

        {children}
      </div>
    </Card>
  );
}
