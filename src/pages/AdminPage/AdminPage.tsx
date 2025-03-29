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
import AdminLayout from "./AdminLayout";
import { fetchUsers, User } from "../../services/Admin/User/userService";
import { fetchPoolTables, PoolTable } from "../../services/Admin/Tables/poolTableService";
import { fetchMatches, MatchData } from "../../services/Admin/Matches/matchesService";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tables, setTables] = useState<PoolTable[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPageTables, setCurrentPageTables] = useState(1);
  const [currentPageMatches, setCurrentPageMatches] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, tablesData, matchesData] = await Promise.all([
          fetchUsers(),
          fetchPoolTables(),
          fetchMatches(),
        ]);

        setUsers(usersData);
        setTables(tablesData);
        setMatches(matchesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      if (match.status === "finished") acc.completed += 1;
      return acc;
    },
    { completed: 0, ready: 0 }
  );

  const matchesChartData = [
    { name: "Ready", value: matchesData.ready },
    { name: "Finished", value: matchesData.completed },
  ];

  const inUseTables = tables.filter((table) => table.status === "in_use");
  const pendingOrPlayingMatches = matches.filter(
    (match) => match.status === "pending" || match.status === "playing"
  );

  // Pagination logic for tables
  const totalPagesTables = Math.ceil(inUseTables.length / itemsPerPage);
  const startIndexTables = (currentPageTables - 1) * itemsPerPage;
  const paginatedTables = inUseTables.slice(startIndexTables, startIndexTables + itemsPerPage);

  // Pagination logic for matches
  const totalPagesMatches = Math.ceil(pendingOrPlayingMatches.length / itemsPerPage);
  const startIndexMatches = (currentPageMatches - 1) * itemsPerPage;
  const paginatedMatches = pendingOrPlayingMatches.slice(startIndexMatches, startIndexMatches + itemsPerPage);

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Tables</h3>
              <p className="text-2xl font-bold">{tables.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Matches</h3>
              <p className="text-2xl font-bold">{matches.length}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Table Status Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Table Status</h3>
              <ResponsiveContainer width="100%" height={300}>
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
              <ResponsiveContainer width="100%" height={300}>
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
                          "#4F46E5", // Indigo-600 for Finished
                        ][index % 4]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tables */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-4 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Tables Overview (Using)</h2>
              <p className="text-sm text-gray-500">Current status in use of Pooltables across all locations</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTables.map((table) => (
                    <tr key={table._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{table._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{table.tableType.type_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            table.status === "available"
                              ? "bg-green-100 text-green-800"
                              : table.status === "in_use"
                                ? "bg-blue-100 text-blue-800"
                                : table.status === "maintenance"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {table.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination for tables */}
            {totalPagesTables > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPageTables((page) => Math.max(1, page - 1))}
                    disabled={currentPageTables === 1}
                    className="relative inline-flex items-center rounded-md p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  {[...Array(totalPagesTables)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPageTables(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        currentPageTables === i + 1
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPageTables((page) => Math.min(totalPagesTables, page + 1))}
                    disabled={currentPageTables === totalPagesTables}
                    className="relative inline-flex items-center rounded-md p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
            <div className="px-4 py-3 border-t border-gray-200 text-right">
            </div>
          </div>

          {/* Matches */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Active Matches</h2>
              <p className="text-sm text-gray-500">Ready and Playing Matches</p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {paginatedMatches.map((match) => (
                  <div key={match._id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Mode Game</p>
                        <p className="font-medium text-gray-900">{match.mode_game}</p>
                      </div>
                      <div className="-ml-4">
                        <p className="text-sm text-gray-500 font-medium">Pool Table</p>
                        <p className="font-medium text-gray-900">{match.pooltable}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Created At</p>
                        <p className="font-medium text-gray-900">
                          {new Date(match.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Status</p>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          match.status === "ready"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {match.status === "ready" ? "Ready" : "Playing"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {paginatedMatches.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No active matches found
                  </div>
                )}
              </div>
              {/* Pagination for matches */}
              {totalPagesMatches > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentPageMatches((page) => Math.max(1, page - 1))}
                      disabled={currentPageMatches === 1}
                      className="relative inline-flex items-center rounded-md p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    {[...Array(totalPagesMatches)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPageMatches(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                          currentPageMatches === i + 1
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPageMatches((page) => Math.min(totalPagesMatches, page + 1))}
                      disabled={currentPageMatches === totalPagesMatches}
                      className="relative inline-flex items-center rounded-md p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-4 text-right">
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPage;
