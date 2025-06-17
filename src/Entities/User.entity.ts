interface User {
  id: UUID;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}
