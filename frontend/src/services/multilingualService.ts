// Multilingual API Service for DeshiBites
// Handles translation data from the database

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  isActive: boolean;
  isDefault: boolean;
}

export interface MenuItemTranslation {
  menuItemId: number;
  languageCode: string;
  name: string;
  description: string;
}

export interface CategoryTranslation {
  categoryId: number;
  languageCode: string;
  name: string;
  description: string;
}

export interface StaticTranslation {
  translationKey: string;
  languageCode: string;
  translationValue: string;
  context: string;
}

export interface RestaurantTranslation {
  restaurantId: number;
  languageCode: string;
  name: string;
  tagline: string;
  description: string;
  address: string;
}

class MultilingualService {
  private baseUrl = '/api/multilingual';

  // Language management
  async getSupportedLanguages(): Promise<Language[]> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`);
      if (!response.ok) throw new Error('Failed to fetch languages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  }

  async updateLanguageStatus(languageCode: string, isActive: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/languages/${languageCode}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating language status:', error);
      return false;
    }
  }

  // Restaurant translations
  async getRestaurantTranslations(restaurantId: number): Promise<RestaurantTranslation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/restaurants/${restaurantId}/translations`);
      if (!response.ok) throw new Error('Failed to fetch restaurant translations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching restaurant translations:', error);
      return [];
    }
  }

  async saveRestaurantTranslation(translation: Partial<RestaurantTranslation>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/restaurants/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translation),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving restaurant translation:', error);
      return false;
    }
  }

  // Menu item translations
  async getMenuItemTranslations(menuItemId: number): Promise<MenuItemTranslation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/menu-items/${menuItemId}/translations`);
      if (!response.ok) throw new Error('Failed to fetch menu item translations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu item translations:', error);
      return [];
    }
  }

  async saveMenuItemTranslation(translation: Partial<MenuItemTranslation>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/menu-items/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translation),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving menu item translation:', error);
      return false;
    }
  }

  async getMenuItemsWithTranslations(restaurantId: number, languageCode: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/restaurants/${restaurantId}/menu-items?lang=${languageCode}`);
      if (!response.ok) throw new Error('Failed to fetch menu items with translations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu items with translations:', error);
      return [];
    }
  }

  // Category translations
  async getCategoryTranslations(categoryId: number): Promise<CategoryTranslation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/${categoryId}/translations`);
      if (!response.ok) throw new Error('Failed to fetch category translations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching category translations:', error);
      return [];
    }
  }

  async saveCategoryTranslation(translation: Partial<CategoryTranslation>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translation),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving category translation:', error);
      return false;
    }
  }

  async getCategoriesWithTranslations(restaurantId: number, languageCode: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/restaurants/${restaurantId}/categories?lang=${languageCode}`);
      if (!response.ok) throw new Error('Failed to fetch categories with translations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories with translations:', error);
      return [];
    }
  }

  // Static translations (UI elements)
  async getStaticTranslations(languageCode: string, context?: string): Promise<StaticTranslation[]> {
    try {
      const url = context 
        ? `${this.baseUrl}/static-translations?lang=${languageCode}&context=${context}`
        : `${this.baseUrl}/static-translations?lang=${languageCode}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch static translations');
      return await response.json();
    } catch (error) {
      console.error('Error fetching static translations:', error);
      return [];
    }
  }

  async saveStaticTranslation(translation: Partial<StaticTranslation>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/static-translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translation),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving static translation:', error);
      return false;
    }
  }

  // Bulk operations
  async bulkImportTranslations(translations: any[], type: 'menu' | 'category' | 'static'): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/bulk-import/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ translations }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error bulk importing translations:', error);
      return false;
    }
  }

  async exportTranslations(restaurantId: number, languageCode?: string): Promise<any> {
    try {
      const url = languageCode 
        ? `${this.baseUrl}/export/${restaurantId}?lang=${languageCode}`
        : `${this.baseUrl}/export/${restaurantId}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to export translations');
      return await response.json();
    } catch (error) {
      console.error('Error exporting translations:', error);
      return null;
    }
  }

  // User language preferences
  async getUserLanguagePreference(userId: number, userType: 'customer' | 'staff'): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/user-preferences/${userType}/${userId}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.languageCode;
    } catch (error) {
      console.error('Error fetching user language preference:', error);
      return null;
    }
  }

  async saveUserLanguagePreference(userId: number, userType: 'customer' | 'staff', languageCode: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userType, languageCode }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving user language preference:', error);
      return false;
    }
  }

  // Translation validation and management
  async validateTranslations(restaurantId: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/validate/${restaurantId}`);
      if (!response.ok) throw new Error('Failed to validate translations');
      return await response.json();
    } catch (error) {
      console.error('Error validating translations:', error);
      return { errors: [], warnings: [] };
    }
  }

  async getTranslationStats(restaurantId: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/stats/${restaurantId}`);
      if (!response.ok) throw new Error('Failed to get translation stats');
      return await response.json();
    } catch (error) {
      console.error('Error getting translation stats:', error);
      return {};
    }
  }

  // Auto-translation (integration with translation services)
  async autoTranslate(text: string, fromLanguage: string, toLanguage: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auto-translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, fromLanguage, toLanguage }),
      });
      
      if (!response.ok) return null;
      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('Error auto-translating text:', error);
      return null;
    }
  }
}

export const multilingualService = new MultilingualService();
export default multilingualService;
