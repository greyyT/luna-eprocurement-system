import axiosInstance from './axios';

export const searchProduct = async (token: string, legalEntityCode: string, search: string) => {
  const PRODUCT_URL = `api/product/${legalEntityCode}?search=${search}`;

  try {
    const res = await axiosInstance.get(PRODUCT_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.data;
  } catch (err) {
    return undefined;
  }
};

export const searchVendor = async (token: string, search: string) => {
  const VENDOR_URL = `/api/vendor?search=${search}&page=1&size=3`;

  try {
    const res = await axiosInstance.get(VENDOR_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.data;
  } catch (err) {
    return undefined;
  }
};
