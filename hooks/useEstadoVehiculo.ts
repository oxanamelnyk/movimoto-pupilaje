import { useState, useEffect } from "react";

interface EstadoOption {
  value: string;
  label: string;
}

export function useEstadoVehiculo() {
  const [options, setOptions] = useState<EstadoOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tipos-estado-vehiculo");
        if (!response.ok) {
          throw new Error("Failed to fetch estados");
        }
        const data = await response.json();
        const formattedOptions = data.map(
          (item: { id: number; nombre: string }) => ({
            value: item.nombre.toLowerCase().replace(/\s+/g, ""),
            label: item.nombre,
          })
        );
        setOptions(formattedOptions);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEstados();
  }, []);

  return { options, loading, error };
}
