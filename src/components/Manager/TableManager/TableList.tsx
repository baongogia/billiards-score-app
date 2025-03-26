import { useState, useEffect } from 'react';
import { PoolTable, fetchPoolTablesByStoreId, updatePoolTable } from '../../../services/Admin/Tables/poolTableService';
import { fetchStores } from '../../../services/Admin/Store/storeService';
import { useAuth } from '../../../context/AuthContext';
import { EditTableModal } from '../../../components/Admin/TablesList/EditTableModal';
import ViewTableModal from '../../../components/Admin/TablesList/ViewTableModal';

const TableList = () => {
  const [tables, setTables] = useState<PoolTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<PoolTable | null>(null);
  const { user } = useAuth();

  const loadTables = async () => {
    try {
      if (!user) return;

      // Tìm store của manager đang đăng nhập
      const storesData = await fetchStores();
      const managerStore = storesData.find(store => store.manager === user._id);

      if (managerStore) {
        // Lấy danh sách bàn của store
        const response = await fetchPoolTablesByStoreId(managerStore._id);
        const storeTables = response.tables;
        setTables(storeTables);
      } else {
        setError("Manager no store manager!");
      }
    } catch (error) {
      console.error("Error loading tables:", error);
      setError("Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, [user]);

  const handleEditClick = (table: PoolTable) => {
    setSelectedTable(table);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (table: PoolTable) => {
    setSelectedTable(table);
    setIsViewModalOpen(true);
  };

  const handleEditSubmit = async (tableData: Partial<PoolTable>) => {
    if (!selectedTable?._id) return;
    try {
      await updatePoolTable(selectedTable._id, tableData);
      await loadTables(); // Refresh the table list after updating
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating table:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pool Tables</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(tables) && tables.map((table) => (
              <tr key={table._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{table._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{table.tableType.type_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    table.status === 'available' ? 'bg-green-100 text-green-800' :
                    table.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {table.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditClick(table)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewClick(table)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditTableModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        table={selectedTable}
      />

      <ViewTableModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        table={selectedTable}
      />
    </div>
  );
};

export default TableList;