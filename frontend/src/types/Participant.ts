export interface ParticipantDTO {
  id: number;
  name: string;
  type: string | null;
  description: string | null;
}

export interface ParticipantCreateRequest {
  name: string;
  type?: string;
  description?: string;
}
