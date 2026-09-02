import { getToken } from "./auth-storage";

export type UserRole = "buyer" | "seller" | "admin";

export type Product = {
  id: number;
  sellerId: number | null;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  createdAt: string;
};

export type Service = {
  id: number;
  sellerId: number | null;
  title: string;
  price: number;
  duration: string;
  image: string;
  description: string;
  createdAt: string;
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
  role: UserRole;
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
    credentials: "include", // send the httpOnly auth cookie too
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

export function getMyProducts(): Promise<Product[]> {
  return request<Product[]>("/api/products/mine");
}

export function createProduct(data: Omit<Product, "id" | "sellerId" | "createdAt">): Promise<Product> {
  return request<Product>("/api/products", { method: "POST", body: JSON.stringify(data) });
}

export function updateProduct(id: number, data: Partial<Omit<Product, "id" | "sellerId" | "createdAt">>): Promise<Product> {
  return request<Product>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteProduct(id: number): Promise<void> {
  return request<void>(`/api/products/${id}`, { method: "DELETE" });
}

export function getServices(): Promise<Service[]> {
  return request<Service[]>("/api/services");
}

export function getMyServices(): Promise<Service[]> {
  return request<Service[]>("/api/services/mine");
}

export function createService(data: Omit<Service, "id" | "sellerId" | "createdAt">): Promise<Service> {
  return request<Service>("/api/services", { method: "POST", body: JSON.stringify(data) });
}

export function updateService(id: number, data: Partial<Omit<Service, "id" | "sellerId" | "createdAt">>): Promise<Service> {
  return request<Service>(`/api/services/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteService(id: number): Promise<void> {
  return request<void>(`/api/services/${id}`, { method: "DELETE" });
}

export function getTestimonials(): Promise<Testimonial[]> {
  return request<Testimonial[]>("/api/testimonials");
}

export function createTestimonial(data: Omit<Testimonial, "id">): Promise<Testimonial> {
  return request<Testimonial>("/api/testimonials", { method: "POST", body: JSON.stringify(data) });
}

export function deleteTestimonial(id: number): Promise<void> {
  return request<void>(`/api/testimonials/${id}`, { method: "DELETE" });
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

export function getAllAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>("/api/appointments");
}

export function updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
  return request<Appointment>(`/api/appointments/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
}

export function deleteAppointment(id: number): Promise<void> {
  return request<void>(`/api/appointments/${id}`, { method: "DELETE" });
}

export function signup(data: { name: string; email: string; password: string; role: "buyer" | "seller" }): Promise<AuthResponse> {
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

export function logout(): Promise<void> {
  return request<void>("/api/auth/logout", { method: "POST" });
}

export function getCurrentUser(): Promise<User> {
  return request<User>("/api/auth/me");
}

export function getAdminUsers(): Promise<User[]> {
  return request<User[]>("/api/admin/users");
}

export function updateUserRole(id: number, role: UserRole): Promise<User> {
  return request<User>(`/api/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
}

export function deleteUser(id: number): Promise<void> {
  return request<void>(`/api/admin/users/${id}`, { method: "DELETE" });
}
