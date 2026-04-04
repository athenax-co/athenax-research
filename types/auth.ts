/** Matches the backend UserRole enum (admin excluded — not self-selectable). */
export type UserRole = "user" | "researcher" | "sponsor" | "founder" | "investor";

/** Kept as alias for any existing imports of `Roles`. */
export type Roles = UserRole;

export type InvestorType = "VC" | "Angel" | "Corporate" | "Family Office";

export interface ResearcherProfileInput {
  labId?: number | null;
  bio?: string | null;
}

export interface SponsorProfileInput {
  bio?: string | null;
  amount?: number | null;
}

export interface InvestorProfileInput {
  investorType: InvestorType;
  balance?: number | null;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  researcherProfile?: ResearcherProfileInput;
  sponsorProfile?: SponsorProfileInput;
  investorProfile?: InvestorProfileInput;
}

export interface SignupResponse {
  message: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  externalId?: string | null;
  researcherProfile?: { labId?: number | null; bio?: string | null } | null;
  sponsorProfile?: { bio?: string | null; amount?: number | null } | null;
  investorProfile?: { investorType: string; balance?: number | null } | null;
  categories?: { categoryId: number }[];
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}
