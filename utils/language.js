let locale = 'vn';

export const setLocale = (lang) => locale = lang;

export const getLocale = () => locale;

export const translate = (lang) => lang?.[locale];