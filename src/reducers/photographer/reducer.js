const INIT_STATE = {
  id: null,
  companyName: '',
  street: '',
  city: '',
  postalCode: '',
  district: '',
  website: '',
  phone: '',
  shippingPrice: null,
  logoUrl: '',
  email: '',
  mobileToken: '',
  appLogoUrl: '',
  appDroidStore: '',
  appAppleStore: '',
  appHideToken: false,
  products: [],
  productCategories: [],
  productAttributes: [],
  iban: null,
  vivawallet: null,
};

export function PhotographerReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case 'SET_INFO':
      var { data } = action;
      if (data === undefined) {
        return { ...state };
      }
      return {
        ...state,
        photographId: data.Id,
        companyName: data.CompanyName,
        street: data.Street,
        city: data.City,
        postalCode: data.PostalCode,
        district: data.District,
        website: data.WebSiteUrl,
        phone: data.Phone,
        shippingPrice: data.ShippingPrice,
        logoUrl: data.LogoUrl,
        email: data.Login,
        productCategories: data.Categories || [],
        productAttributes: data.Attributes || [],
        mobileToken: data.MobileToken,
        appLogoUrl: data.AppLogoUrl,
        appDroidStore: data.BrandingAppLinkPlay,
        appAppleStore: data.BrandingAppLinkApple,
        appHideToken: data.BrandingAppHideTokenText,
        iban: data.IBAN,
        vivawallet: data.VivaWalletId,
      };
    case 'ADD_PRODUCTS':
      var products = action.data;
      if (products === undefined) {
        return { ...state };
      }
      var newState = { ...state, products: products };
      return newState;

    default:
      return { ...state };
  }
}
