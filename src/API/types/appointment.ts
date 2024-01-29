type TAppointment = {
  id: number;
  worker: {
    id: number;
    name: string;
    email: string;
  };
  client: {
    id: number;
    name: string;
    email: string;
  };
  date: string;
  end_date: string;
  service: {
    id: number;
    name: string;
    category: string;
    price: number;
  };
  created_at: string;
  updated_at: string;
};
