import { getToken } from "./auth-storage";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
};

export type Service = {
  id: number;
  title: string;
  price: number;
  duration: string;
  image: string;
  description: string;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export type AppointmentInput = {
  name: string;
  email: string;
  phone?: string;
  fittingType: string;
  notes?: string;
};

export type Appointment = AppointmentInput & {
  id: number;
  userId: number | null;
  status: string;
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function getProducts(): Promise<Product[]> {
  return request<Product[]>("/api/products");
}

export function getServices(): Promise<Service[]> {
  return request<Service[]>("/api/services");
}

export function getTestimonials(): Promise<Testimonial[]> {
  return request<Testimonial[]>("/api/testimonials");
}

export function createAppointment(data: AppointmentInput): Promise<Appointment> {
  return request<Appointment>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMyAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>("/api/appointments/mine");
}

export function signup(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: { email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCurrentUser(): Promise<User> {
  return request<User>("/api/auth/me");
}
