// DeshiBites Internationalization System
// React i18n hook and context for English/German support

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Translation type definitions
export interface Translations {
  // Navigation
  nav: {
    home: string;
    menu: string;
    orders: string;
    customers: string;
    analytics: string;
    staff: string;
    inventory: string;
    settings: string;
  };
  
  // Common actions
  action: {
    add: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    refresh: string;
    view: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
  };
  
  // Order management
  order: {
    status: {
      pending: string;
      confirmed: string;
      preparing: string;
      ready: string;
      out_for_delivery: string;
      delivered: string;
      completed: string;
      cancelled: string;
    };
    type: {
      dine_in: string;
      takeaway: string;
      delivery: string;
      online: string;
    };
    payment: {
      pending: string;
      paid: string;
      failed: string;
      refunded: string;
    };
    details: string;
    items: string;
    total: string;
    subtotal: string;
    tax: string;
    delivery_fee: string;
    discount: string;
    tip: string;
  };
  
  // Menu management
  menu: {
    categories: string;
    items: string;
    addons: string;
    variations: string;
    tags: {
      vegetarian: string;
      vegan: string;
      halal: string;
      spicy: string;
      popular: string;
      new: string;
      chef_special: string;
      gluten_free: string;
      dairy_free: string;
    };
    spice: {
      none: string;
      mild: string;
      medium: string;
      hot: string;
      very_hot: string;
    };
    price: string;
    description: string;
    preparation_time: string;
    calories: string;
    available: string;
    featured: string;
  };
  
  // Customer management
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    loyalty_points: string;
    total_orders: string;
    total_spent: string;
    registration_date: string;
    last_order: string;
  };
  
  // Staff management
  staff: {
    employee_id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    hire_date: string;
    salary: string;
    active: string;
    shifts: string;
    permissions: string;
  };
  
  // Settings
  settings: {
    general: string;
    appearance: string;
    notifications: string;
    integrations: string;
    users: string;
    security: string;
    billing: string;
    backup: string;
    language: string;
    theme: string;
    logo: string;
    banner: string;
    colors: string;
    contact: string;
    social_media: string;
    business_hours: string;
  };
  
  // POS Integration
  pos: {
    connection: {
      connected: string;
      disconnected: string;
      connecting: string;
      error: string;
    };
    sync: {
      menu: string;
      orders: string;
      payments: string;
      inventory: string;
      last_sync: string;
      sync_now: string;
      auto_sync: string;
    };
    provider: string;
    merchant_id: string;
    location_id: string;
    environment: string;
    test_connection: string;
  };
  
  // Messages and notifications
  message: {
    success: string;
    error: string;
    warning: string;
    info: string;
    loading: string;
    saved: string;
    deleted: string;
    updated: string;
    created: string;
    no_data: string;
    confirm_delete: string;
  };
  
  // Forms
  form: {
    required: string;
    invalid_email: string;
    invalid_phone: string;
    password_too_short: string;
    passwords_dont_match: string;
    upload_image: string;
    select_option: string;
    enter_value: string;
  };
  
  // Time and dates
  time: {
    today: string;
    yesterday: string;
    this_week: string;
    this_month: string;
    this_year: string;
    minutes: string;
    hours: string;
    days: string;
    weeks: string;
    months: string;
  };
  
  // Dashboard
  dashboard: {
    overview: string;
    recent_orders: string;
    popular_items: string;
    revenue: string;
    customers: string;
    growth: string;
    statistics: string;
  };
}

// English translations
const englishTranslations: Translations = {
  nav: {
    home: 'Home',
    menu: 'Menu',
    orders: 'Orders',
    customers: 'Customers',
    analytics: 'Analytics',
    staff: 'Staff',
    inventory: 'Inventory',
    settings: 'Settings'
  },
  action: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    view: 'View',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No'
  },
  order: {
    status: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    type: {
      dine_in: 'Dine In',
      takeaway: 'Takeaway',
      delivery: 'Delivery',
      online: 'Online'
    },
    payment: {
      pending: 'Pending',
      paid: 'Paid',
      failed: 'Failed',
      refunded: 'Refunded'
    },
    details: 'Order Details',
    items: 'Items',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    delivery_fee: 'Delivery Fee',
    discount: 'Discount',
    tip: 'Tip'
  },
  menu: {
    categories: 'Categories',
    items: 'Menu Items',
    addons: 'Add-ons',
    variations: 'Variations',
    tags: {
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      halal: 'Halal',
      spicy: 'Spicy',
      popular: 'Popular',
      new: 'New',
      chef_special: "Chef's Special",
      gluten_free: 'Gluten Free',
      dairy_free: 'Dairy Free'
    },
    spice: {
      none: 'No Spice',
      mild: 'Mild',
      medium: 'Medium',
      hot: 'Hot',
      very_hot: 'Very Hot'
    },
    price: 'Price',
    description: 'Description',
    preparation_time: 'Prep Time',
    calories: 'Calories',
    available: 'Available',
    featured: 'Featured'
  },
  customer: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    loyalty_points: 'Loyalty Points',
    total_orders: 'Total Orders',
    total_spent: 'Total Spent',
    registration_date: 'Registration Date',
    last_order: 'Last Order'
  },
  staff: {
    employee_id: 'Employee ID',
    name: 'Name',
    role: 'Role',
    email: 'Email',
    phone: 'Phone',
    hire_date: 'Hire Date',
    salary: 'Salary',
    active: 'Active',
    shifts: 'Shifts',
    permissions: 'Permissions'
  },
  settings: {
    general: 'General',
    appearance: 'Appearance',
    notifications: 'Notifications',
    integrations: 'Integrations',
    users: 'Users',
    security: 'Security',
    billing: 'Billing',
    backup: 'Backup',
    language: 'Language',
    theme: 'Theme',
    logo: 'Logo',
    banner: 'Banner',
    colors: 'Colors',
    contact: 'Contact Information',
    social_media: 'Social Media',
    business_hours: 'Business Hours'
  },
  pos: {
    connection: {
      connected: 'Connected',
      disconnected: 'Disconnected',
      connecting: 'Connecting...',
      error: 'Connection Error'
    },
    sync: {
      menu: 'Sync Menu',
      orders: 'Sync Orders',
      payments: 'Sync Payments',
      inventory: 'Sync Inventory',
      last_sync: 'Last Sync',
      sync_now: 'Sync Now',
      auto_sync: 'Auto Sync'
    },
    provider: 'POS Provider',
    merchant_id: 'Merchant ID',
    location_id: 'Location ID',
    environment: 'Environment',
    test_connection: 'Test Connection'
  },
  message: {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    loading: 'Loading...',
    saved: 'Saved successfully',
    deleted: 'Deleted successfully',
    updated: 'Updated successfully',
    created: 'Created successfully',
    no_data: 'No data available',
    confirm_delete: 'Are you sure you want to delete this item?'
  },
  form: {
    required: 'This field is required',
    invalid_email: 'Please enter a valid email address',
    invalid_phone: 'Please enter a valid phone number',
    password_too_short: 'Password must be at least 8 characters',
    passwords_dont_match: 'Passwords do not match',
    upload_image: 'Upload Image',
    select_option: 'Select an option',
    enter_value: 'Enter value'
  },
  time: {
    today: 'Today',
    yesterday: 'Yesterday',
    this_week: 'This Week',
    this_month: 'This Month',
    this_year: 'This Year',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    weeks: 'weeks',
    months: 'months'
  },
  dashboard: {
    overview: 'Overview',
    recent_orders: 'Recent Orders',
    popular_items: 'Popular Items',
    revenue: 'Revenue',
    customers: 'Customers',
    growth: 'Growth',
    statistics: 'Statistics'
  }
};

// German translations
const germanTranslations: Translations = {
  nav: {
    home: 'Startseite',
    menu: 'Speisekarte',
    orders: 'Bestellungen',
    customers: 'Kunden',
    analytics: 'Analytik',
    staff: 'Personal',
    inventory: 'Lager',
    settings: 'Einstellungen'
  },
  action: {
    add: 'Hinzufügen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    search: 'Suchen',
    filter: 'Filtern',
    export: 'Exportieren',
    import: 'Importieren',
    refresh: 'Aktualisieren',
    view: 'Anzeigen',
    close: 'Schließen',
    confirm: 'Bestätigen',
    yes: 'Ja',
    no: 'Nein'
  },
  order: {
    status: {
      pending: 'Ausstehend',
      confirmed: 'Bestätigt',
      preparing: 'In Zubereitung',
      ready: 'Bereit',
      out_for_delivery: 'Unterwegs',
      delivered: 'Geliefert',
      completed: 'Abgeschlossen',
      cancelled: 'Storniert'
    },
    type: {
      dine_in: 'Im Restaurant',
      takeaway: 'Zum Mitnehmen',
      delivery: 'Lieferung',
      online: 'Online'
    },
    payment: {
      pending: 'Ausstehend',
      paid: 'Bezahlt',
      failed: 'Fehlgeschlagen',
      refunded: 'Erstattet'
    },
    details: 'Bestelldetails',
    items: 'Artikel',
    total: 'Gesamt',
    subtotal: 'Zwischensumme',
    tax: 'Steuer',
    delivery_fee: 'Liefergebühr',
    discount: 'Rabatt',
    tip: 'Trinkgeld'
  },
  menu: {
    categories: 'Kategorien',
    items: 'Speisekarte',
    addons: 'Zusätze',
    variations: 'Variationen',
    tags: {
      vegetarian: 'Vegetarisch',
      vegan: 'Vegan',
      halal: 'Halal',
      spicy: 'Scharf',
      popular: 'Beliebt',
      new: 'Neu',
      chef_special: 'Küchenchef-Spezial',
      gluten_free: 'Glutenfrei',
      dairy_free: 'Laktosefrei'
    },
    spice: {
      none: 'Nicht scharf',
      mild: 'Mild',
      medium: 'Mittel',
      hot: 'Scharf',
      very_hot: 'Sehr scharf'
    },
    price: 'Preis',
    description: 'Beschreibung',
    preparation_time: 'Zubereitungszeit',
    calories: 'Kalorien',
    available: 'Verfügbar',
    featured: 'Empfohlen'
  },
  customer: {
    name: 'Name',
    email: 'E-Mail',
    phone: 'Telefon',
    address: 'Adresse',
    loyalty_points: 'Treuepunkte',
    total_orders: 'Gesamtbestellungen',
    total_spent: 'Gesamtausgaben',
    registration_date: 'Registrierungsdatum',
    last_order: 'Letzte Bestellung'
  },
  staff: {
    employee_id: 'Mitarbeiter-ID',
    name: 'Name',
    role: 'Rolle',
    email: 'E-Mail',
    phone: 'Telefon',
    hire_date: 'Einstellungsdatum',
    salary: 'Gehalt',
    active: 'Aktiv',
    shifts: 'Schichten',
    permissions: 'Berechtigungen'
  },
  settings: {
    general: 'Allgemein',
    appearance: 'Erscheinungsbild',
    notifications: 'Benachrichtigungen',
    integrations: 'Integrationen',
    users: 'Benutzer',
    security: 'Sicherheit',
    billing: 'Abrechnung',
    backup: 'Sicherung',
    language: 'Sprache',
    theme: 'Design',
    logo: 'Logo',
    banner: 'Banner',
    colors: 'Farben',
    contact: 'Kontaktinformationen',
    social_media: 'Soziale Medien',
    business_hours: 'Öffnungszeiten'
  },
  pos: {
    connection: {
      connected: 'Verbunden',
      disconnected: 'Getrennt',
      connecting: 'Verbinde...',
      error: 'Verbindungsfehler'
    },
    sync: {
      menu: 'Menü synchronisieren',
      orders: 'Bestellungen synchronisieren',
      payments: 'Zahlungen synchronisieren',
      inventory: 'Lager synchronisieren',
      last_sync: 'Letzte Synchronisation',
      sync_now: 'Jetzt synchronisieren',
      auto_sync: 'Auto-Synchronisation'
    },
    provider: 'POS-Anbieter',
    merchant_id: 'Händler-ID',
    location_id: 'Standort-ID',
    environment: 'Umgebung',
    test_connection: 'Verbindung testen'
  },
  message: {
    success: 'Erfolgreich',
    error: 'Fehler',
    warning: 'Warnung',
    info: 'Information',
    loading: 'Lädt...',
    saved: 'Erfolgreich gespeichert',
    deleted: 'Erfolgreich gelöscht',
    updated: 'Erfolgreich aktualisiert',
    created: 'Erfolgreich erstellt',
    no_data: 'Keine Daten verfügbar',
    confirm_delete: 'Sind Sie sicher, dass Sie dieses Element löschen möchten?'
  },
  form: {
    required: 'Dieses Feld ist erforderlich',
    invalid_email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    invalid_phone: 'Bitte geben Sie eine gültige Telefonnummer ein',
    password_too_short: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    passwords_dont_match: 'Die Passwörter stimmen nicht überein',
    upload_image: 'Bild hochladen',
    select_option: 'Option auswählen',
    enter_value: 'Wert eingeben'
  },
  time: {
    today: 'Heute',
    yesterday: 'Gestern',
    this_week: 'Diese Woche',
    this_month: 'Diesen Monat',
    this_year: 'Dieses Jahr',
    minutes: 'Minuten',
    hours: 'Stunden',
    days: 'Tage',
    weeks: 'Wochen',
    months: 'Monate'
  },
  dashboard: {
    overview: 'Übersicht',
    recent_orders: 'Aktuelle Bestellungen',
    popular_items: 'Beliebte Artikel',
    revenue: 'Umsatz',
    customers: 'Kunden',
    growth: 'Wachstum',
    statistics: 'Statistiken'
  }
};

// Translation store
const translations: Record<LanguageCode, Translations> = {
  en: englishTranslations,
  de: germanTranslations
};

// Context and hooks
interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  languages: typeof SUPPORTED_LANGUAGES;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: LanguageCode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  defaultLanguage = 'en' 
}) => {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    // Try to get language from localStorage or use default
    const saved = localStorage.getItem('deshibites_language');
    return (saved && saved in SUPPORTED_LANGUAGES) ? saved as LanguageCode : defaultLanguage;
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('deshibites_language', language);
    // Set HTML lang attribute for accessibility
    document.documentElement.lang = language;
    // Set direction for RTL languages (none currently, but prepared for future)
    document.documentElement.dir = 'ltr';
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    languages: SUPPORTED_LANGUAGES,
    isRTL: false // None of our current languages are RTL
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use i18n
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Hook for nested translation paths
export const useTranslation = (path?: string) => {
  const { t, language } = useI18n();
  
  const getNestedTranslation = (obj: any, path: string): string => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || path;
  };

  const translate = (key: string): string => {
    if (path) {
      const fullKey = `${path}.${key}`;
      return getNestedTranslation(t, fullKey);
    }
    return getNestedTranslation(t, key);
  };

  return { t: translate, language };
};

// Utility function for dynamic translations from database
export const useDynamicTranslation = () => {
  const { language } = useI18n();
  
  const translateItem = (item: any, field: string): string => {
    // Try to get translated field first
    const translatedField = `${field}_${language}`;
    if (item[translatedField]) {
      return item[translatedField];
    }
    
    // Fallback to English
    const englishField = `${field}_en`;
    if (item[englishField]) {
      return item[englishField];
    }
    
    // Fallback to original field
    return item[field] || '';
  };

  return { translateItem, language };
};

export default I18nProvider;
