// Define the shape of the user object
export interface User {
  _id: string;
  email: string;
  name: string;
}
export interface Session {
  user: User;
  expires?: Date; // This is the expiry of the session,
}

// Define the context
export interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  createAccount: (data: NewUserProps) => void;
  signIn: (data: NewUserProps) => void;
  signOut: () => void;
  refreshToken: () => void;
}

export interface NewUserProps {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
}
