import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ManagerLayout from "./ManagerLayout";
import { fetchPoolTablesByStoreId, PoolTable } from "../../services/Admin/Tables/poolTableService";
import { fetchStores } from "../../services/Admin/Store/storeService";
import { fetchMatches, MatchData } from "../../services/Admin/Matches/matchesService";
import { useAuth } from "../../context/AuthContext";

const ManagerPage = () => {
  const [tables, setTables] = useState<PoolTable[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) return;

        // Tìm store của manager
        const storesData = await fetchStores();
        const managerStore = storesData.find(store => store.manager === user._id);

        if (managerStore) {
          // Lấy danh sách bàn của store
          const tablesResponse = await fetchPoolTablesByStoreId(managerStore._id);
          const storeTables = tablesResponse.tables;
          setTables(storeTables);

          // Lấy tất cả matches và lọc theo các bàn của store
          const allMatches = await fetchMatches();
          const storeMatches = allMatches.filter(match => 
            storeTables.some(table => table._id === match.pooltable)
          );
          setMatches(storeMatches);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const inUseTabless = tables.filter((table) => table.status === "in_use");
  const availableTables = tables.filter((table) => table.status === "available");
  const maintenanceTables = tables.filter((table) => table.status === "maintenance");

  const chartData = [
    { name: "In Use", value: inUseTabless.length },
    { name: "Available", value: availableTables.length },
    { name: "Maintenance", value: maintenanceTables.length },
  ];

  const matchesData = matches.reduce(
    (acc, match) => {
      if (match.status === "ready") acc.ready += 1;
      if (match.status === "playing") acc.playing += 1;
      if (match.status === "pending") acc.pending += 1;
      if (match.status === "finished") acc.completed += 1;
      return acc;
    },
    { pending: 0, playing: 0, completed: 0, ready: 0 }
  );

  const matchesChartData = [
    { name: "Ready", value: matchesData.ready },
    { name: "Playing", value: matchesData.playing },
    { name: "Pending", value: matchesData.pending },
    { name: "Finished", value: matchesData.completed },
  ];

  return (
    <ManagerLayout>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Tables</h3>
              <p className="text-2xl font-bold">{tables.length}</p>
              <p className="text-sm text-gray-500">{inUseTabless.length} in use</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Matches</h3>
              <p className="text-2xl font-bold">{matches.length}</p>
              <p className="text-sm text-gray-500">{matchesData.playing} playing</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Table Status Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Table Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          "#F59E0B",
                          "#10B981",
                          "#EF4444",
                        ][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} tables`, name]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '6px',
                      padding: '8px',
                      border: 'none',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Matches Overview Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Matches Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={matchesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#4B5563' }}
                    axisLine={{ stroke: '#9CA3AF' }}
                  />
                  <YAxis
                    tick={{ fill: '#4B5563' }}
                    axisLine={{ stroke: '#9CA3AF' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '6px',
                      padding: '8px',
                      border: 'none',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  >
                    {matchesChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          "#A78BFA", // Violet-400 for Ready
                          "#818CF8", // Indigo-400 for Pending
                          "#6366F1", // Indigo-500 for Playing
                          "#4F46E5", // Indigo-600 for Finished
                        ][index % 4]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </ManagerLayout>
  );
};

export default ManagerPage;
