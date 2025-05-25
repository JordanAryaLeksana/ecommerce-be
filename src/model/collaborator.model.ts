

enum CollaboratorRole {
  ecommerce_expert = "ecommerce_expert",
  supplier = "supplier",
  influencer = "influencer",
  developer = "developer",
}

export interface CollaboratorRequest {
  name: string;
  email: string;
  role: CollaboratorRole;
}

export interface CollaboratorResponse {
  name: string;
  email: string;
  role: CollaboratorRole;
}