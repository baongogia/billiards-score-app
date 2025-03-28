import api from "../../api";

// Định nghĩa interface cho PoolTable dựa trên response data
export interface TableType {
  type_name: string;
  compatible_mode: string[];
  _id?: string; // Optional vì có trong response nhưng không cần trong request
}

export interface PoolTable {
  _id: string; // Sử dụng _id thay vì id để khớp với response
  status: "available" | "in_use" | "maintenance";
  tableType: TableType;
  store: string;
  deletedAt: null | string;
  createdAt: string;
  updatedAt: string;
  qrCodeImg: string;
  __v?: number; // Optional versioning field từ MongoDB
}

// Request interface cho create/update
export interface PoolTableRequest {
  status: "available" | "in_use" | "maintenance";
  tableType: {
    type_name: string;
    compatible_mode: string[];
  };
  store: string;
}

// Fetch all pool tables
export const fetchPoolTables = async (): Promise<PoolTable[]> => {
  try {
    const response = await api.get<{ data: PoolTable[] }>("v1/pooltables");
    console.log("Get table success");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching pool tables:", error);
    throw error;
  }
};

// Fetch pool table by ID
export const fetchPoolTableById = async (id: string): Promise<PoolTable> => {
  try {
    const response = await api.get<{ data: PoolTable }>(`v1/pooltables/${id}`);
    console.log("Get table id success");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching pool table:", error);
    throw error;
  }
};

// Create pool table
export const createPoolTable = async (poolTableData: PoolTableRequest): Promise<PoolTable> => {
  try {
    const response = await api.post<{ data: PoolTable }>("v1/pooltables", poolTableData);
    console.log("Create table success");
    return response.data.data;
  } catch (error) {
    console.error("Error creating pool table:", error);
    throw error;
  }
};

// Update pool table
export const updatePoolTable = async (id: string, poolTableData: Partial<PoolTableRequest>): Promise<PoolTable> => {
  try {
    const response = await api.put<{ data: PoolTable }>(`v1/pooltables/${id}`, poolTableData);
    console.log("Update table success");
    return response.data.data;
  } catch (error) {
    console.error("Error updating pool table:", error);
    throw error;
  }
};

// Delete pool table
export const deletePoolTable = async (id: string): Promise<void> => {
  try {
    await api.delete(`v1/pooltables/${id}`);
    console.log("Delete table success");
  } catch (error) {
    console.error("Error deleting pool table:", error);
    throw error;
  }
};

// Fetch pool tables by store ID
export const fetchPoolTablesByStoreId = async (storeId: string): Promise<{
  number: number,
  tables: PoolTable[]}
  > => {
  try {
    const response = await api.get(`v1/stores/viewPooltable/${storeId}`);
    console.log("get table in store success");  
    return {
      number: response.data.data.number,
      tables: response.data.data.tables
    };
  } catch (error) {
    console.error("Error fetching pool tables by store ID:", error);
    throw error;
  }
};