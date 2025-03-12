import api from "../../api";

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

export const searchStore = async (searchTerm: string): Promise<Store[]> => {
  try {
    const response = await api.get<{ data: Store }>("v1/stores", {
      params: { action: "findOne", id: searchTerm },
    });

    const store = response.data.data;
    if (!store.isDeleted) {
      return [store];
    } else {
      return [];
    }
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