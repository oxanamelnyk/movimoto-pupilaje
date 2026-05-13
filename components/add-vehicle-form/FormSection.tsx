import { Card } from "@/components/ui/card";

interface FormSectionProps {
  icon: string;
  title: string;
  children: React.ReactNode;
}

export function FormSection({ icon, title, children }: FormSectionProps) {
  return (
    <Card className="border-0 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b">
          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-600">{icon}</span>
          </div>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>

        {children}
      </div>
    </Card>
  );
}
