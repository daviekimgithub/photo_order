import {
  addProductAttributesConfig,
  addAttributesGroupConfig,
  updateAttributesGroupItemSelection,
} from '../../core/helpers/attributesConfigHelper';
import { getPixelCrop } from '../../components/3d/helpers/cropConfigHelper';

export const INIT_STATE = {
  photographerId: 0,
  orderId: '',
  orderGuid: '',
  status: 'NEW',
  email: 'missing',
  phone: 'missing',
  firstName: 'missing',
  lastName: 'missing',
  shippingSelected: false,
  shippingName: '',
  shippingAddress: '',
  shippingEmail: '',
  paymentMethod: 0,
  //orderInitialized: false,
  //orderRequestSend: false,
  //orderSending: false,
  //orderFinalized: false,
  orderItems: [
    // {
    //   id: 'adacasdada',
    //   fileUrl:
    //     'https://cdn.natemat.pl/cf55267c7b80326b81fd2e8f8e1cc42b,981,0,0,0.jpg',
    //   fileName: 'wakacje01.jpg',
    //   productId: 4398,
    //   quantity: 2,
    //     attributes: [],
    // },
    // {
    //   id: 'vsasdgdsfgs',
    //   fileUrl:
    //     'https://g.gazetaprawna.pl/p/_wspolne/pliki/4548000/4548447-wakacje-podroz.jpg',
    //   fileName: 'wakacje01.jpg',
    //   productId: 4398,
    //   quantity: 2,
    // },
    // {
    //   id: '1asdsgsafsg',
    //   fileUrl:
    //     'https://s3.egospodarka.pl/grafika2/turystyka-zagraniczna/Wakacje-2018-na-razie-taniej-niz-rok-temu-201769-640x640.jpg',
    //   fileName: 'wakacje01.jpg',
    //   productId: 4400,
    //   quantity: 1,
    // },
  ],
  orderItemsConfig: [
    // {
    //   productId: 1,
    //   pack: 1,
    //   configs: [
    //     {groupId: 1, selected: 12},
    //     {groupId: 2, selected: 32}
    //   ]
    // }
  ],
};

export function OrderReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case 'NEW':
      return { ...INIT_STATE };

    case 'CREATE':
      const { PhotographerId, OrderId, OrderGuid } = action.payload;
      const { Email, FirstName, LastName, Phone } = action.payload;
      const { IsShippingChoosen } = action.payload;

      return {
        ...state,
        photographerId: PhotographerId,
        orderId: OrderId,
        orderGuid: OrderGuid,
        phone: Phone,
        email: Email,
        firstName: FirstName,
        lastName: LastName,
        shippingSelected: IsShippingChoosen,
        status: 'INITIALIZED',
      };

    case 'ADD_ORDER_ITEM':
      return { ...state, orderItems: [action.payload, ...state.orderItems] };

    case 'ADD_ORDER_ITEM_AT_END':
      return { ...state, orderItems: [...state.orderItems, action.payload] };

    case 'ADD_ORDER_ITEMS_AT_END':
      const newItems = action.payload.filter((newItem) => !state.orderItems.some((existingItem) => existingItem.guid === newItem.guid));
      return { ...state, orderItems: [...state.orderItems, ...newItems] };
      
    case 'REPLACE_ORDER_ITEM':
      const replacedOrderItems = [
        ...state.orderItems.map((item) => {
          if (item.guid !== action.payload.oldGuid) return item;

          let newItem = { ...action.payload, guid: action.payload.newGuid };

          return newItem;
        }),
      ];

      return { ...state, orderItems: [...replacedOrderItems] };

    case 'ADD_ORDER_ITEM_TEXTURE_3D':
      const newOrderItems = [
        ...state.orderItems.map((item) => {
          if (item.productId !== action.payload.productId) return item;
          if (item.isLayerItem === true) return item;

          if (
            item.productId === action.payload.productId &&
            !item.isLayerItem
          ) {
            item = { ...action.payload };
          }

          return item;
        }),
      ];
      const textureAdded = newOrderItems.find(
        (i) =>
          i.productId === action.payload.productId && i.isLayerItem !== true
      );

      if (!textureAdded) newOrderItems.push(action.payload);

      return { ...state, orderItems: [...newOrderItems] };

    case 'UPDATE_ORDER_ITEM_CROP':
      const newOrderItemsWithCrop = [
        ...state.orderItems.map((item) => {
          if (item.guid !== action.payload.guid) return item;

          item.cropObj = action.payload.crop;

          item.completedCropObj = getPixelCrop(
            action.payload.crop,
            item.width,
            item.height
          );

          return item;
        }),
      ];

      return { ...state, orderItems: [...newOrderItemsWithCrop] };

    case 'UPDATE_ORDER_ITEM_TEXTURE_CONFIG':
      const newOrderItemsWithConfig = [
        ...state.orderItems.map((item) => {
          if (item.guid !== action.payload.guid) return item;

          item.layerConfig = action.payload;
          return item;
        }),
      ];
      return { ...state, orderItems: [...newOrderItemsWithConfig] };

    case 'UPDATE_ORDER_ITEM_TEXTURE_CONFIG_MULTI':
      const newOrderItemsWithConfigMulti = [
        ...state.orderItems.map((item) => {
          if (action.payload.filter((c) => c.guid === item.guid).length === 0)
            return item;

          const newConfig = action.payload.find((i) => i.guid === item.guid);
          item.layerConfig = newConfig;
          return item;
        }),
      ];
      return { ...state, orderItems: [...newOrderItemsWithConfigMulti] };

    case 'UPDATE_ORDER_ITEM_CROP_COMPLETE':
      const newOrderItemsWithCompletedCrop = [
        ...state.orderItems.map((item) => {
          if (item.guid !== action.payload.guid) return item;
          item.completedCropObj = action.payload.crop;
          item.cropObj = action.payload.crop;
          return item;
        }),
      ];

      return { ...state, orderItems: [...newOrderItemsWithCompletedCrop] };

    case 'INCREASE_ORDER_ITEM_QTY':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.map((item) => {
            if (item.guid === action.payload.guid) {
              item.qty++;
            }
            return item;
          }),
        ],
      };

    case 'DECRESE_ORDER_ITEM_QTY':
      return {
        ...state,
        orderItems: [
          ...state.orderItems
            .map((item) => {
              if (item.guid === action.payload.guid) {
                item.qty--;
              }
              return item;
            })
            .filter((item) => item.qty > 0),
        ],
      };

    case 'REMOVE_ORDER_ITEMS_FOR_PRODUCT':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.filter(
            (item) => item.productId !== action.payload.productId
          ),
        ],
      };

    case 'ORDER_ITEM_SET_STATE_PROCESSING':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.map((item) => {
            if (item.guid === action.payload.guid) {
              item.status = 'processing';
            }
            return item;
          }),
        ],
      };

    case 'ORDER_ITEM_SET_STATE_SUCCESS':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.map((item) => {
            if (item.guid === action.payload.guid) {
              item.status = 'success';
              item.fileAsBase64 = null; //release memory
              item.fileUrl = action.payload.url;
              item.imageGuid = action.payload.fileGuid;
            }
            return item;
          }),
        ],
      };

    case 'ORDER_ITEM_SET_STATE_FAILED':
      return {
        ...state,
        orderItems: [
          ...state.orderItems.map((item) => {
            if (item.guid === action.payload.guid) {
              item.status = 'failed';
            }
            return item;
          }),
        ],
      };

    case 'ORDER_SET_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload.paymentMethod,
      };

    case 'ORDER_SET_FIRST_NAME':
      return {
        ...state,
        firstName: action.payload.firstName,
      };

    case 'ORDER_SET_LAST_NAME':
      return {
        ...state,
        lastName: action.payload.lastName,
      };

    case 'ORDER_SET_EMAIL':
      return {
        ...state,
        email: action.payload.email,
      };

    case 'ORDER_SET_PHONE':
      return {
        ...state,
        phone: action.payload.phone,
      };

    case 'ORDER_SET_SHIPPING':
      return {
        ...state,
        shippingSelected: action.payload.shipping,
      };

    case 'ORDER_SET_SHIPPING_NAME':
      return {
        ...state,
        shippingName: action.payload.shippingName,
      };

    case 'ORDER_SET_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload.shippingAddress,
      };

    case 'ORDER_SET_SHIPPING_EMAIL':
      return {
        ...state,
        shippingEmail: action.payload.shippingEmail,
      };

    case 'ORDER_ITEM_SET_ATTRIBUTES':
      //check if config container is on the list, add if needed
      let newOrderItemsConfig = addProductAttributesConfig(
        state.orderItemsConfig,
        action.payload
      );

      //foreach config container check if attribute config is on the list, add if needed
      newOrderItemsConfig = newOrderItemsConfig.map((item) => {
        let newConfig = addAttributesGroupConfig(item, action.payload);
        newConfig.configs = newConfig.configs.map((cfg) =>
          updateAttributesGroupItemSelection(cfg, action.payload)
        );

        return newConfig;
      });

      return {
        ...state,
        orderItemsConfig: [...newOrderItemsConfig],
      };

    case 'FINALIZE':
      return {
        ...state,
        status: 'FINALIZING',
      };

    case 'FINALIZE_REQUESTED':
      return {
        ...state,
        status: 'PROCESSING',
      };

    case 'SUCCESS':
      return {
        ...state,
        status: 'SUCCESS',
      };

    case 'FAILED':
      return { ...state, status: 'ERROR' };

    default:
      return state;
  }
}
