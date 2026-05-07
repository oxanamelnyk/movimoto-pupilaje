export type Vehicle = {
  id: string;
  client: string;
  status: string;
  brand: string;
  model: string;
  vin_or_plate: string;
  entryDate: string;
  exitDate?: string;
  location: string;
  requestDate?: string;
  requestedBy?: string;
  destination?: string;
  notes?: string;
  unpackingDate?: string;
  unpackingType?: string;
};

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    client: "Zontes",
    status: "Ingresado",
    brand: "Zontes",
    model: "ZT125",
    vin_or_plate: "1234ABC",
    entryDate: "01/01/2024",
    location: "BC1",
    requestDate: "31/12/2023",
    requestedBy: "Juan García",
    destination: "Taller A",
    notes: "Revisión general",
  },
  {
    id: "2",
    client: "Shamax",
    status: "Ingresado",
    brand: "Shamax",
    model: "300",
    vin_or_plate: "5678DEF",
    entryDate: "05/02/2024",
    location: "BC2",
    requestDate: "04/02/2024",
    requestedBy: "María López",
    destination: "Taller B",
  },
  {
    id: "3",
    client: "Ducati",
    status: "Retirado",
    brand: "Ducati",
    model: "Monster 821",
    vin_or_plate: "9876GHI",
    entryDate: "10/01/2024",
    exitDate: "20/02/2024",
    location: "BC1",
    requestDate: "09/01/2024",
    requestedBy: "Carlos Ruiz",
    destination: "Cliente",
    unpackingDate: "20/02/2024",
    unpackingType: "Desembalaje completo",
  },
  {
    id: "4",
    client: "Carbo",
    status: "Ingresado",
    brand: "Carbo",
    model: "Carbio 125",
    vin_or_plate: "2468JKL",
    entryDate: "12/02/2024",
    location: "BC3",
    requestDate: "11/02/2024",
    requestedBy: "Ana Martínez",
    notes: "Pendiente de revisión",
  },
  {
    id: "5",
    client: "Quadis",
    status: "Retirado",
    brand: "Quadis",
    model: "Q2 300",
    vin_or_plate: "1357MNO",
    entryDate: "15/01/2024",
    exitDate: "18/02/2024",
    location: "BC2",
    requestDate: "14/01/2024",
    requestedBy: "Pedro González",
    destination: "Cliente",
    unpackingDate: "18/02/2024",
    unpackingType: "Desembalaje parcial",
  },
  {
    id: "6",
    client: "Zontes",
    status: "Ingresado",
    brand: "Zontes",
    model: "ZT310",
    vin_or_plate: "3698PQR",
    entryDate: "16/02/2024",
    location: "BC1",
    requestDate: "15/02/2024",
    requestedBy: "Laura Fernández",
    destination: "Taller A",
  },
  {
    id: "7",
    client: "Shamax",
    status: "Retirado",
    brand: "Shamax",
    model: "250",
    vin_or_plate: "7410STU",
    entryDate: "02/01/2024",
    exitDate: "08/02/2024",
    location: "BC3",
    requestDate: "01/01/2024",
    requestedBy: "David Sánchez",
    destination: "Cliente",
    unpackingDate: "08/02/2024",
    unpackingType: "Desembalaje completo",
  },
  {
    id: "8",
    client: "Ducati",
    status: "Ingresado",
    brand: "Ducati",
    model: "Scrambler",
    vin_or_plate: "8520VWX",
    entryDate: "17/02/2024",
    location: "BC2",
    requestDate: "16/02/2024",
    requestedBy: "Elena Moreno",
    destination: "Taller B",
  },
];
