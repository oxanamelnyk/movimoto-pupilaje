import { Card } from "@/components/ui/card";

interface FormSectionProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <Card className="border-0 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b">
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>

        {children}
      </div>
    </Card>
  );
}
