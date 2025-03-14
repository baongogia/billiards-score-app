import api from "../../api";
import { PoolTable } from "../Tables/poolTableService";

export interface Store {
  _id: string;
  name: string;
  status: string;
  address: string;
  manager: string;
  isDeleted: boolean;
}

export const fetchStores = async (): Promise<Store[]> => {
  try {
    const response = await api.get<{ data: Store[] }>("v1/stores", {
      params: { action: "findAll" },
    });
    return response.data.data.filter(store => !store.isDeleted);
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

export const fetchStoreById = async (id: string): Promise<Store> => {
  try {
    const response = await api.get<{ data: Store }>(`v1/stores/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching store by ID:", error);
    throw error;
  }
};

export const deleteStore = async (storeId: string): Promise<void> => {
  try {
    await api.delete(`v1/stores/${storeId}`);
  } catch (error) {
    console.error("Error deleting store:", error);
    throw error;
  }
};

export const updateStore = async (storeId: string, newName: string): Promise<Store> => {
  try {
    const response = await api.put(
      `v1/stores/${storeId}`,
      { name: newName }
    );
    return response.data as Store;
  } catch (error) {
    console.error("Error updating store:", error);
    throw error;
  }
};

export const fetchInactiveStores = async (): Promise<Store[]> => {
  try {
    const response = await api.get<{ data: Store[] }>("v1/stores/showDeleted");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching inactive stores:", error);
    throw error;
  }
};

export interface SearchStoreParams {
  term?: string;           // Từ khóa tìm kiếm
  isDeleted?: boolean;     // Trạng thái xóa
  current?: number;        // Trang hiện tại
  pageSize?: number;       // Số lượng item mỗi trang
  sortBy?: string;         // Trường để sắp xếp
  sortDirection?: string;  // Hướng sắp xếp (asc/desc)
}

export const searchStore = async (searchParams: Partial<SearchStoreParams> = {}): Promise<Store[]> => {
  try {
    // Tạo object chỉ chứa các trường có giá trị (loại bỏ undefined)
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([value]) => value !== undefined)
    );

    // Gửi request với filteredParams
    const response = await api.get<{ data: Store[] }>("v1/stores/search", {
      params: filteredParams,
    });

    const stores = response.data.data;
    // Lọc các store chưa bị xóa (nếu cần)
    return Array.isArray(stores) ? stores.filter(store => !store.isDeleted) : [];
  } catch (error) {
    console.error("Error searching store:", error);
    throw error;
  }
};

export const createStore = async (name: string, address: string, manager: string): Promise<Store> => {
  try {
    const response = await api.post(
      "v1/stores",
      {
        name,
        address,
        manager,
      }
    );
    return response.data.data as Store;
  } catch (error) {
    console.error("Error creating store:", error);
    throw error;
  }
};

export interface StoreResponse {
  data: {
    data: Store[];
    pagination: {
      totalItem: number;
      current: number;
      pageSize: number;
      totalPage: number;
    };
  };
}

export const fetchFilteredStores = async (
  term?: string,
  status?: string,
  current?: number,
  pageSize?: number,
  sortBy?: string,
  sortDirection?: string
): Promise<{data: Store[], pagination: { totalItem: number; current: number; pageSize: number; totalPage: number }}> => {
  try {
    const isDeleted = status === "inactive" ? true : status === "active" ? false : undefined;
    const queryParams = new URLSearchParams();
    
    if (term) queryParams.append("term", term);
    queryParams.append("isDeleted", String(isDeleted ?? false));
    if (current) queryParams.append("current", String(current));
    if (pageSize) queryParams.append("pageSize", String(pageSize));
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortDirection) queryParams.append("sortDirection", sortDirection);

    console.log("Query params:", queryParams.toString()); // Debug log

    const response = await api.get<StoreResponse>(`v1/stores/search?${queryParams.toString()}`);
    
    let filteredData = response.data.data.data;
    if (status === "active") {
      filteredData = filteredData.filter(store => !store.isDeleted);
    } else if (status === "inactive") {
      filteredData = filteredData.filter(store => store.isDeleted);
    }

    return {
      data: filteredData,
      pagination: response.data.data.pagination
    };
  } catch (error) {
    console.error("Error fetching filtered stores:", error);
    throw error;
  }
};

export interface StorePoolTablesResponse {
  data: {
    number: number;
    tables: PoolTable[];
  };
}

export const fetchStorePoolTables = async (storeId: string): Promise<PoolTable[]> => {
  try {
    console.log('Fetching tables for store:', storeId);
    const response = await api.get<StorePoolTablesResponse>(`v1/stores/viewPooltable/${storeId}`);
    console.log('API Response:', response.data);
    const tables = response.data.data.tables;
    console.log('Extracted tables:', tables);
    return tables || [];
  } catch (error) {
    console.error("Error fetching store pool tables:", error);
    throw error;
  }
};