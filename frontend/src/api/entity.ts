import axiosInstance from './axios';

export const deleteUserFromEntity = async (token: string, email: string, legalEntityCode: string) => {
  const USER_URL = `/api/${legalEntityCode}/${email}`;

  try {
    await axiosInstance.delete(USER_URL, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    return true;
  } catch (err) {
    return undefined;
  }
};

export const createDepartment = async (token: string, name: string, code: string, legalEntityCode: string) => {
  const DEPARTMENT_URL = `/api/department`;

  try {
    await axiosInstance.post(
      DEPARTMENT_URL,
      { departmentCode: code, departmentName: name, legalEntityCode },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return true;
  } catch (err) {
    return undefined;
  }
};

export const setUserDepartment = async (token: string, code: string, userEmail: string) => {
  const DEPARTMENT_URL = `/api/department/set-department`;

  try {
    await axiosInstance.post(
      DEPARTMENT_URL,
      { departmentCode: code, userEmail },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return true;
  } catch (err) {
    return undefined;
  }
};

export const deleteDepartment = async (token: string, code: string) => {
  const DEPARTMENT_URL = `/api/department/${code}`;

  try {
    await axiosInstance.delete(DEPARTMENT_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    return undefined;
  }
};

export const createTeam = async (token: string, name: string, code: string, departmentCode: string) => {
  const TEAM_URL = `/api/team`;

  try {
    await axiosInstance.post(
      TEAM_URL,
      { teamCode: code, teamName: name, departmentCode },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return true;
  } catch (err) {
    return undefined;
  }
};

export const setUserTeam = async (token: string, teamCode: string, userEmail: string) => {
  const TEAM_URL = `/api/team/set-team`;

  try {
    await axiosInstance.post(
      TEAM_URL,
      { teamCode, userEmail },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return true;
  } catch (err) {
    return undefined;
  }
};

export const setUserRole = async (token: string, role: string, userEmail: string) => {
  const USER_URL = `/api/account/set-role`;

  try {
    await axiosInstance.post(
      USER_URL,
      { userEmail, role },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return true;
  } catch (err) {
    return undefined;
  }
};

export const createProduct = async (token: string, product: object) => {
  const PRODUCT_URL = `/api/product`;

  try {
    await axiosInstance.post(PRODUCT_URL, product, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    return undefined;
  }
};

export const addPrice = async (token: string, productCode: string | undefined, vendorCode: string, price: string) => {
  const VENDOR_URL = `/api/product/assignToVendor`;

  try {
    await axiosInstance.post(
      VENDOR_URL,
      { productCode, vendorCode, price },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return true;
  } catch (err) {
    return undefined;
  }
};

export const patchrPrice = async (
  token: string,
  legalEntityCode: string,
  productCode: string | undefined,
  vendorCode: string,
  price: string,
) => {
  const VENDOR_URL = `/api/product/${legalEntityCode}/${productCode}/${vendorCode}/${price}`;

  try {
    await axiosInstance.patch(
      VENDOR_URL,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return true;
  } catch (err) {
    return undefined;
  }
};

export const deleteProduct = async (token: string, productCode: string) => {
  const PRODUCT_URL = `/api/product/${productCode}`;

  try {
    await axiosInstance.delete(PRODUCT_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    return undefined;
  }
};

export const createVendor = async (token: string, vendor: object) => {
  const VENDOR_URL = `/api/vendor`;

  try {
    await axiosInstance.post(VENDOR_URL, vendor, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    return undefined;
  }
};

export const addContact = async (token: string, vendorCode: string | undefined, contact: object) => {
  const VENDOR_URL = `/api/vendor/${vendorCode}/addContact`;

  try {
    await axiosInstance.post(VENDOR_URL, contact, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (err) {
    return undefined;
  }
};
