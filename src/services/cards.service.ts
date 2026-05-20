import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export interface Card {
  card_id?: number;
  card_number: string;
  card_type?: string;
  expiry_date?: string;
  status?: string;
  linked_account?: string;
}

export function getCards(): Promise<Card[]> {
  return apiGet<Card[]>("/cards");
}

export function getCardById(id: number): Promise<Card> {
  return apiGet<Card>(`/cards/${id}`);
}

export function createCard(data: Partial<Card>): Promise<Card> {
  return apiPost<Card>("/cards", data);
}

export function updateCard(id: number, data: Partial<Card>): Promise<Card> {
  return apiPut<Card>(`/cards/${id}`, data);
}

export function deleteCard(id: number): Promise<Card> {
  return apiDelete<Card>(`/cards/${id}`);
}
