export interface Place {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    category?: string;
    rating?: number;
    address?: string;
    thumbnail?: string;
    note?: string;
    description?: string;
}