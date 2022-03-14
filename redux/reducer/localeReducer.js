import { HYDRATE } from 'next-redux-wrapper';
import locales from "../../locales";

export const initState = {
    locale: 'vn',
    lang: locales['vn']
}
const localeReducer = (state = initState, action) => {
    switch (action.type) {
        case HYDRATE: {
            console.log('set1', action.payload.locale.locale)
            const nextLocale = action.payload.locale.locale;
            const locale = nextLocale !== initState.locale ? nextLocale : state.locale;
            return {
                locale: locale,
                lang: locales[locale]
            }
        }
        case 'SET_LOCALE': {
            console.log('set', action.payload)
            if (!locales[action.payload]) return state;
            return {
                locale: action.payload,
                lang: locales[action.payload]
            };

        }
        default: {
            return state;
        }
    }
};

export default localeReducer;