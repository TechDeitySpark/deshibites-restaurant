export interface MenuItem {
  id: number;
  title: string;
  price: string;
  description: string;
  category: string;
  badges: string[];
  spiceLevel: string;
}

export interface MenuCategory {
  name: string;
  icon: string;
}
