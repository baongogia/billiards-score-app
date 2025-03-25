import{ useState, useEffect } from 'react';
import { PoolTable, fetchPoolTablesByStoreId } from '../../../services/Admin/Tables/poolTableService';
import { fetchStores } from '../../../services/Admin/Store/storeService';
import { useAuth } from '../../../context/AuthContext';

const TableList = () => {
  const [tables, setTables] = useState<PoolTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadTables = async () => {
      try {
        if (!user) return;
        
        // Tìm store của manager đang đăng nhập
        const storesData = await fetchStores();
        const managerStore = storesData.find(store => store.manager === user._id);
        
        if (managerStore) {
          // Lấy danh sách bàn của store
          const storeTables = await fetchPoolTablesByStoreId(managerStore._id);
          setTables(storeTables);
        } else {
          setError("No store found for this manager.");
        }
      } catch (error) {
        console.error("Error loading tables:", error);
        setError("Failed to load tables");
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, [user]);

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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tables.map((table) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableList;