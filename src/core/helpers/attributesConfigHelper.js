export function addProductAttributesConfig(currentConfig, newConfig) {
  let result = [...currentConfig];
  const configExist = currentConfig.find(
    (cfg) =>
      cfg.productId === newConfig.productId && cfg.pack === newConfig.pack
  );
  if (!configExist) {
    result.push({
      productId: newConfig.productId,
      pack: newConfig.pack,
      configs: [],
    });
  }
  return result;
}

export function addAttributesGroupConfig(currentConfig, newConfig) {
  let result = { ...currentConfig };
  if (currentConfig.productId !== newConfig.productId) return result;
  if (currentConfig.pack !== newConfig.pack) return result;

  const configExist = currentConfig.configs.find(
    (cfg) => cfg.groupId === newConfig.groupId
  );
  if (!configExist) {
    result.configs.push({
      groupId: newConfig.groupId,
      selected: newConfig.selected,
    });
  }

  return result;
}

export function updateAttributesGroupItemSelection(groupConfig, newConfig) {
  let result = { ...groupConfig };

  if (groupConfig.groupId === newConfig.groupId) {
    result.selected = newConfig.selected;
  }

  return result;
}
