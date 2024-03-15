import legacy from '../core/legacyAPI';
import api from '../core/newAPI';

const OrderService = () => {
  function GetPhotographer(id) {
    const endpoint = `photographer/${id}`;
    return legacy.get(endpoint);
  }

  function GetProducts(id) {
    const endpoint = `products/photographer/${id}`;
    return api.get(endpoint);
  }

  function GetBanners(photographerId) {
    const endpoint = `Advertisement/Photographer/${photographerId}`;
    return api.get(endpoint);
  }

  function CreateOrder(id) {
    const endpoint = `photographer/${id}/order`;
    const body = {
      email: 'missing',
      firstName: 'missing',
      lastName: 'missing',
      phone: 'missing',
      orderItems: [],
    };
    return legacy.post(endpoint, body);
  }

  const FinalizeOrder = async (order, photographer) => {
    const endpoint = `photographer/order/${order.orderId}`;

    const { productAttributes } = photographer;
    const { orderItemsConfig } = order;

    //get greoups and default values
    let defaultAttributes = productAttributes.map((group) => {
      let att;
      if (group.Attributes.length > 0) {
        att = group.Attributes[0];
      }
      return {
        groupId: group.Id,
        selected: att?.Id,
      };
    });

    const orderedItems = order.orderItems.map((item) => {
      let itemAttributes = [];

      const productInfo = photographer.products.find(
        (pa) => pa.id === item.productId
      );
      if (productInfo && productInfo.attributes?.length > 0) {
        const groupIds = [
          ...new Set(productInfo.attributes.map((p) => p.attributesGroupId)),
        ];
        //get item config from context:
        const config = orderItemsConfig.find(
          (c) => c.productId === item.productId
        );
        //read all selected items
        groupIds.map((id) => {
          const selectedValue = config?.configs?.find((c) => c.groupId === id);
          if (selectedValue) itemAttributes.push(selectedValue.selected);
          else {
            const defaultSelection = defaultAttributes.find(
              (a) => a.groupId === id
            );
            if (defaultSelection)
              itemAttributes.push(defaultSelection.selected);
          }
        });
      }

      let result = {
        FileName: item.filePath,
        FileGuid: item.imageGuid,
        FileUrl: item.fileUrl,
        ProductId: item.productId,
        Quantity: item.qty,
        Attributes: itemAttributes,
        FilePath: item.filePath,
        // SavedFiles: item.savedFiles
      };
      let layerIndex = -1;
      if (item.isLayerItem === true) {
        layerIndex++;
        const config = {
          X: 0,
          Y: 0,
          Width: 0,
          Height: 0,
          ScaleFactoryUp: 1,
          Guid: item.imageGuid,
          Index: layerIndex,
        };

        result.sizes = config;
      }

      return result;
    });

    const orderData = JSON.parse(getCurrentOrderFromStorage(photographer.photographId));

    const body = {
      FirstName: orderData?.firstName,
      LastName: orderData?.lastName,
      Phone: orderData?.phone,
      Email: orderData?.email,
      StreetAddress: orderData?.shippingStreet || "",
      City: orderData?.shippingCity || "",
      Country: orderData?.shippingCountry || "",
      ZipCode: orderData?.shippingZip || "",
      IsShippingChoosen: orderData.shippingSelected,
      OrderGuid: order.orderGuid,
      OrderItems: orderedItems,
      PaymentMethod: order.paymentMethod,
    };

    await setLocalStorageOrder(
      photographer.photographId, 
      { ...body, Status: 'Sent'}
    )

    removeOrderFromLocalStorage(photographer.photographId);

    if (order.paymentMethod == 2) {
      var vivawalletUrl = photographer.vivawallet;

      window.open(vivawalletUrl);
    }
    console.log(JSON.stringify(orderedItems, null, 3))
    const response = legacy.put(endpoint, body);
    console.log(JSON.stringify(response, null, 3))

    return response
  }

  function MarkOrderAsDone(order) {
    const endpoint = `orders/${order.orderId}/done`;
    return legacy.post(endpoint, '');
  }

  function UploadImage(model) {
    const endpoint = `photographer/order/${model.orderId}/photo`;
    const body = {
      OrderGuid: model.orderGuid,
      ProductId: model.productId,
      FileAsBase64: model.fileAsBase64,
      FileName: model.fileName,
      TrackingGuid: model.fileGuid,
      Attributes: model.attributes,
    };
    console.log('image data from device' ,JSON.stringify(body, null, 3))
    return legacy.post(endpoint, body);
  }

  const setLocalStorageOrder = async (userId, orderData) => {
    try {
      const currentTime = new Date().getTime().toString();
      const serializedValue = JSON.stringify({ ...orderData, currentTime });
      
      localStorage.setItem(`${userId}_${currentTime}`, serializedValue);
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  };

  const getAllLocalStorageOrders = async (userId) => {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key.startsWith(`${userId}_`)) {
        const value = localStorage.getItem(key);
        items.push({ key, value });
      }
    }
    return items;
  };

  const setCurrentOrderToStorage = (orderData, userId) => {
    try {
      const currentData = localStorage.getItem(userId);
      let mergedData = {};
      
      if (currentData) {
        mergedData = JSON.parse(currentData);
      }
  
      mergedData = { ...mergedData, ...orderData };
      
      if (mergedData.orderItems && mergedData.orderItems.length > 0) {
        mergedData.orderItems.forEach(orderItem => {
            orderItem.fileAsBase64 = "";
        });
      }
  
      if (mergedData.shippingSelected === false) {
        const { shippingCountry, shippingStreet, shippingZip, shippingCity, ...rest } = mergedData;
        mergedData = rest;
      }
  
      const serializedValue = JSON.stringify(mergedData);
      
      localStorage.setItem(userId, serializedValue);
    } catch (err) {
      console.error('Error setting localStorage item:', err);
    }
  };  

  const getCurrentOrderFromStorage = (userId) => {
    try {
      return localStorage.getItem(userId);
    } catch (err) {
      console.error('Error setting localStorage item:', err);
    }
  };

  const removeOrderFromLocalStorage = (id) => {
    try {
      localStorage.removeItem(id);
    } catch (err) {
      console.error('Error setting localStorage item:', err);
    }
  }

  return {
    GetPhotographer,
    GetBanners,
    GetProducts,
    CreateOrder,
    FinalizeOrder,
    MarkOrderAsDone,
    UploadImage,
    getAllLocalStorageOrders,
    setCurrentOrderToStorage,
    getCurrentOrderFromStorage,
    setLocalStorageOrder,
    removeOrderFromLocalStorage
  };
};

export default OrderService;
