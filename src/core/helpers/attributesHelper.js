const calculateAttributeGroups = (product, photographer) => {
  const groupIds = [
    ...new Set(product.attributes.map((p) => p.attributesGroupId)),
  ];
  return photographer.productAttributes.filter((a) => groupIds.includes(a.Id));
};

const calculateAttributes = (group, product) => {
  return product.attributes
    .filter((a) => a.attributesGroupId === group.Id)
    .sort((a, b) => a.position < b.position);
};

export function getSelectedAttributes(productId, order, photographer) {
  if (!photographer.products) return [];
  const product = photographer.products.find((p) => p.id === productId);
  if (!product) return [];
  if (!order) return [];

  const attributesGroups = calculateAttributeGroups(product, photographer);

  const selectedAttributes = attributesGroups.map((g) => {
    const availableAttributes = calculateAttributes(g, product);

    const { orderItemsConfig } = order;
    const actualConfigs = orderItemsConfig.find(
      (c) => c.productId === productId
    );
    if (actualConfigs && actualConfigs.configs?.length > 0) {
      const configExist = actualConfigs.configs.find((c) => c.groupId === g.Id);
      if (configExist) {
        const selectedAttribute = availableAttributes.find(
          (a) => a.id === configExist.selected
        );
        if (selectedAttribute) return selectedAttribute;
      }
    }

    return availableAttributes[0];
  });

  return selectedAttributes ?? [];
}
