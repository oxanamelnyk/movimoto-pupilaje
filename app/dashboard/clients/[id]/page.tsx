"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil } from "lucide-react";

interface Client {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function ClientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/clients/${clientId}`);
        if (!response.ok) throw new Error("Failed to fetch client");
        const data = await response.json();
        setClient(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch client");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando cliente...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error || "Cliente no encontrado"}
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => router.push("/dashboard/clients")}>
              Clientes
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Client Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{client.name}</h1>
                  <Badge className={getStatusBadgeColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
                {client.description && (
                  <p className="text-gray-600 mb-3">{client.description}</p>
                )}
                <div className="space-y-1 text-sm text-gray-500">
                  {client.email && <p>Email: {client.email}</p>}
                  {client.phone && <p>Teléfono: {client.phone}</p>}
                </div>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(`/dashboard/clients/${client.id}/edit`)
              }
              variant="outline"
              size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Editar cliente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="invoices" className="w-full">
            <TabsList>
              <TabsTrigger value="invoices">Facturas</TabsTrigger>
              <TabsTrigger value="tariffs">Tarifas</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="mt-4">
              <div className="py-8 text-center text-gray-500">
                <p>El contenido de facturas se agregará aquí</p>
              </div>
            </TabsContent>

            <TabsContent value="tariffs" className="mt-4">
              <div className="py-8 text-center text-gray-500">
                <p>El contenido de tarifas se agregará aquí</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
