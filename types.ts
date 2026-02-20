export interface Car {
  id: string;
  name: string;
  year: number;
  price: number;
  image: string;
  engine: string;
  horsepower: number;
  transmission: string;
  mileage: number;
  description: string;
  category: 'sports' | 'luxury' | 'convertible' | 'utility';
}

export interface Part {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  compatibility: string[];
  inStock: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: 'vehicle' | 'part';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
