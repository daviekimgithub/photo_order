//Core
import { useQuery, useMutation, useQueryClient } from 'react-query';

//Components
import OrderService from './OrderService';

function useGetPhotographer(id) {
  const service = OrderService();
  let success = true;
  const photographerId = Number(id);
  const enabledOption = photographerId > 0;
  const result = useQuery(
    ['photographer-data', photographerId],
    async () => {
      const resp = await service.GetPhotographer(photographerId).then(
        (res) => res.data,
        (err) => {
          success = false;
          return err;
        }
      );
      if (!success) {
        throw new Error(resp);
      }

      return resp;
    },
    {
      enabled: enabledOption,
    }
  );
  return { ...result };
}

function useGetBanners(id) {
  const service = OrderService();
  let success = true;
  const photographerId = Number(id);
  const enabledOption = photographerId > 0;
  const result = useQuery(
    ['photographer-banners', photographerId],
    async () => {
      const resp = await service.GetBanners(photographerId).then(
        (res) => res.data,
        (err) => {
          success = false;
          return err;
        }
      );
      if (!success) {
        throw new Error(resp);
      }

      return resp;
    },
    {
      enabled: enabledOption,
    }
  );
  return { ...result };
}

function useGetProducts(id) {
  const service = OrderService();
  let success = true;
  const photographerId = Number(id);
  const enabledOption = photographerId > 0;
  const result = useQuery(
    ['photographer-products', photographerId],
    async () => {
      const resp = await service.GetProducts(photographerId).then(
        (res) => res.data,
        (err) => {
          success = false;
          return err;
        }
      );
      if (!success) {
        throw new Error(resp);
      }

      return resp;
    },
    {
      enabled: enabledOption,
    }
  );
  return { ...result };
}

export { useGetPhotographer, useGetProducts, useGetBanners };
