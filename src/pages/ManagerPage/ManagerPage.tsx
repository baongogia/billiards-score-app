import React, { useState, useEffect } from "react";
import ManagerLayout from "./ManagerLayout";
import { Table, Users, DollarSign, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchUsers, User } from "../../services/Admin/User/userService";
import { MatchData } from "../../services/Admin/Matches/matchesService";
import { fetchPoolTables, PoolTable } from "../../services/Admin/Tables/poolTableService";
import { fetchMatches } from "../../services/Admin/Matches/matchesService";
import { fetchStores, Store } from "../../services/Admin/Store/storeService";

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tables, setTables] = useState<PoolTable[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPageTables, setCurrentPageTables] = useState(1);
  const [currentPageMatches, setCurrentPageMatches] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, tablesData, matchesData, storesData] = await Promise.all([
          fetchUsers(),
          fetchPoolTables(),
          fetchMatches(),
          fetchStores(),
        ]);

        setUsers(usersData);
        setTables(tablesData);
        setMatches(matchesData);
        setStores(storesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    <ManagerLayout>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Tables</p>
                  <p className="text-2xl font-bold mt-1">{tables.length}</p>
                  <p className="text-xs text-gray-500 mt-1">{inUseTables.length} in use</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-md">
                  <Table size={20} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Members</p>
                  <p className="text-2xl font-bold mt-1">{users.length}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-md">
                  <Users size={20} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Stores</p>
                  <p className="text-2xl font-bold mt-1">{stores.length}</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-md">
                  <DollarSign size={20} className="text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Matches</p>
                  <p className="text-2xl font-bold mt-1">{matches.length}</p>
                </div>
                <div className="p-2 bg-orange-50 rounded-md">
                  <Clock size={20} className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-4 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Tables Overview</h2>
              <p className="text-sm text-gray-500">Current status of billiard tables across all locations</p>
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
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                View All Tables
              </button>
            </div>
          </div>

          {/* Matches */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Matches</h2>
              <p className="text-sm text-gray-500">Today's matches and results</p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {paginatedMatches.map((match) => (
                  <div key={match._id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium text-gray-900">{match.mode_game}</p>
                      <p className="text-sm text-gray-500">{match.createdAt}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full 
                      ${
                        match.status === "Completed"
                          ? "bg-gray-100 text-gray-800"
                          : match.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>
                ))}
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
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  View All Matches
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </ManagerLayout>
  );
};

export default AdminPage;