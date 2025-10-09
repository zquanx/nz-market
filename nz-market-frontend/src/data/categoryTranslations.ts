// Category translations for internationalization
export const categoryTranslations = {
  en: {
    'All': 'All',
    'Electronics': 'Electronics',
    'Fashion': 'Fashion',
    'Gaming': 'Gaming',
    'Sports': 'Sports',
    'Home & Garden': 'Home & Garden',
    'Musical Instruments': 'Musical Instruments',
    'Furniture': 'Furniture',
    'Books': 'Books',
    'Toys & Games': 'Toys & Games'
  },
  zh: {
    'All': '全部',
    'Electronics': '电子产品',
    'Fashion': '时尚',
    'Gaming': '游戏',
    'Sports': '运动',
    'Home & Garden': '家居园艺',
    'Musical Instruments': '乐器',
    'Furniture': '家具',
    'Books': '图书',
    'Toys & Games': '玩具游戏'
  }
};

export const getCategoryTranslation = (category: string, language: 'en' | 'zh'): string => {
  return categoryTranslations[language][category] || category;
};

// Condition translations
export const conditionTranslations = {
  en: {
    'NEW': 'New',
    'LIKE_NEW': 'Like New',
    'GOOD': 'Good',
    'FAIR': 'Fair'
  },
  zh: {
    'NEW': '全新',
    'LIKE_NEW': '几乎全新',
    'GOOD': '良好',
    'FAIR': '一般'
  }
};

export const getConditionTranslation = (condition: string, language: 'en' | 'zh'): string => {
  return conditionTranslations[language][condition] || condition;
};
