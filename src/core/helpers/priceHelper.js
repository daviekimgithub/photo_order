import { getSelectedAttributes } from './attributesHelper';

export function formatPrice(num) {
  if (typeof num !== 'number') return null;
  const result = Math.round((num + Number.EPSILON) * 100) / 100;
  return `${result.toFixed(2)}`;
}

function priceCalculator(productId, quantity, photographer, order) {
  const product = photographer.products.find((p) => p.id === productId);
  if (!product) throw new Error('Missing product info, cant calculate price');

  let priceUnitBase = 0;
  let priceUnitModificator = 0;
  let priceUnitPercentModificator = 1;

  let estimatedPrice = 0;
  let estimatedQuantity = quantity;

  let productBasePrices = null;

  const { price, productPrices } = product;
  if (price) priceUnitBase = price;

  const { quantityRangeMin, quantityRangeMax } = product;
  if (
    quantityRangeMin &&
    quantityRangeMin > 0 &&
    quantityRangeMax &&
    quantityRangeMax >= quantityRangeMin
  ) {
    let step = 1;
    while(quantity > quantityRangeMax * step){
      step++;
    }
    estimatedQuantity = step;
  }else{
    estimatedQuantity=quantity;
  }

  //calculate base price for given range
  if (productPrices && productPrices.length > 0) {
    priceUnitBase = productPrices[0].price;

    productPrices.forEach((p) => {
      if (p.priceLevelFrom > estimatedQuantity) return;

      if (p.priceLevelTo >= estimatedQuantity || p.priceLevelTo == 0) {
        priceUnitBase = p.price;
      }
    });
    estimatedPrice = priceUnitBase;
  }

  //calculate by attributes
  const attributes = getSelectedAttributes(productId, order, photographer)
      .sort((a,b)=>b.priceCorrectionPercent - a.priceCorrectionPercent);

  if (attributes && attributes.length > 0) {
    const percentValues = attributes.map(a=>a.priceCorrectionPercent);

    percentValues.forEach(pV =>{
      if(pV != 0){
        estimatedPrice *= pV / 100;
        priceUnitPercentModificator *= pV/100;
      }
    });

    attributes.forEach(a=>{
      if(a.priceCorrectionCurrent != 0){
        estimatedPrice += a.priceCorrectionCurrent;
        priceUnitModificator += a.priceCorrectionCurrent;
      }
    })
    estimatedPrice = Math.round(estimatedPrice * 100) / 100;
  }

  //prepare product base range prices
  if (productPrices && productPrices.length > 0) {
    productBasePrices = productPrices.map((p) => {
      let result = { ...p };
      const calculatedPrice = (p.price * priceUnitPercentModificator)+priceUnitModificator;
      result.price = Math.round(calculatedPrice * 100) / 100;
      return result;
    });
  }

  const result = {
    priceUnitBase,
    productBasePrices,
    priceUnitModificator,
    priceUnitPercentModificator,
    estimatedPrice,
    estimatedQuantity,
    finalPrice: estimatedPrice * estimatedQuantity,
  };

  return result;
}

export function getLabelPrice(productId, quantity, photographer, order) {
  const calculation = priceCalculator(productId, quantity || 1, photographer, order);
  if (calculation) return calculation.finalPrice;

  return 0;
}

export function getPrice(productId, quantity, photographer, order) {
  const calculation = priceCalculator(productId, quantity, photographer, order);
  if (calculation) return calculation.finalPrice;

  return 0;
}

export function getRangePrice(productId, priceId, photographer, order) {
  const calculation = priceCalculator(productId, 1, photographer, order);
  if (calculation && calculation.productBasePrices) {
    const priceRange = calculation.productBasePrices.find(
      (p) => p.id === priceId
    );
    if (priceRange) return priceRange.price;
  }

  return 0;
}

export function getShare3dPrice(product) {
  if (!product) return 0;
  var { productPrices } = product;
  if (!productPrices || productPrices.length == 0) return 0;

  const lowestPrice = productPrices.reduce((acc, loc) =>
    acc.price < loc.price ? acc : loc
  );
  return lowestPrice.price;
}
