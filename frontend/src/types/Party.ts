export interface PartyDTO {
  id: number;
  name: string;
  description: string | null;
  memberIds: Set<number>;
}

export interface PartyCreateDTO {
  name: string;
  description: string;
}