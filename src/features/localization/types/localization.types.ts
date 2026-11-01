export interface LanguageItem {
  code: string;
  name: string;
  native: string;
}

export interface LanguagesData {
  current_language: string;
  language_details: LanguageItem;
  supported_languages: LanguageItem[];
}

export interface GetLanguagesResponse {
  status: boolean;
  code: number;
  message: string;
  data: LanguagesData;
}

export interface ChangeLanguagePayload {
  lang: string;
}

export interface ChangeLanguageResponse {
  status: boolean;
  code: number;
  message: string;
  data: LanguagesData & {
    user_preference_saved?: boolean;
  };
}

