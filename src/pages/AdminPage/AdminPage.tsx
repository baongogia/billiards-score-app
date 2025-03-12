
import AdminLayout from "./AdminLayout";
import { Table, Users, DollarSign, Clock } from "lucide-react";

// Sample data for tables
const tables = [
  { id: 1, name: "Table 1", type: "Pool", status: "occupied", timeRemaining: "45 min", players: "John & Mike" },
  { id: 2, name: "Table 2", type: "Snooker", status: "available", timeRemaining: "-", players: "-" },
  { id: 3, name: "Table 3", type: "Pool", status: "reserved", timeRemaining: "Starts in 15 min", players: "Sarah & Team" },
  { id: 4, name: "Table 4", type: "Carom", status: "maintenance", timeRemaining: "-", players: "-" },
  { id: 5, name: "Table 5", type: "Pool", status: "occupied", timeRemaining: "1 hr 20 min", players: "Tournament Group A" },
];

// Sample data for matches
const matches = [
  { id: 1, type: "8-Ball Tournament", date: "Today, 3:30 PM", player1: { name: "Alex Johnson", score: 5 }, player2: { name: "Michael Smith", score: 3 }, status: "Completed" },
  { id: 2, type: "9-Ball Challenge", date: "Today, 5:15 PM", player1: { name: "Sarah Williams", score: 7 }, player2: { name: "David Brown", score: 7 }, status: "In Progress" },
  { id: 3, type: "Snooker Exhibition", date: "Today, 6:00 PM", player1: { name: "James Wilson", score: 0 }, player2: { name: "Robert Taylor", score: 0 }, status: "Starting Soon" },
];

const AdminPage = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tables</p>
              <p className="text-2xl font-bold mt-1">24</p>
              <p className="text-xs text-gray-500 mt-1">18 active, 6 maintenance</p>
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
              <p className="text-2xl font-bold mt-1">2,350</p>
              <p className="text-xs text-gray-500 mt-1">+180 from last month</p>
            </div>
            <div className="p-2 bg-green-50 rounded-md">
              <Users size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
              <p className="text-2xl font-bold mt-1">$4,290</p>
              <p className="text-xs text-gray-500 mt-1">+20.1% from yesterday</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-md">
              <DollarSign size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Play Time</p>
              <p className="text-2xl font-bold mt-1">1.8 hrs</p>
              <p className="text-xs text-gray-500 mt-1">Per table booking</p>
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
              {tables.map((table) => (
                <tr key={table.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{table.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{table.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        table.status === "available"
                          ? "bg-green-100 text-green-800"
                          : table.status === "occupied"
                            ? "bg-blue-100 text-blue-800"
                            : table.status === "reserved"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {table.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{table.timeRemaining}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{table.players}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            {matches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{match.type}</p>
                  <p className="text-sm text-gray-500">{match.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{match.player1.name}</p>
                    <p className="text-2xl font-bold">{match.player1.score}</p>
                  </div>
                  <div className="text-gray-500 font-medium">vs</div>
                  <div>
                    <p className="font-medium">{match.player2.name}</p>
                    <p className="text-2xl font-bold">{match.player2.score}</p>
                  </div>
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
          <div className="mt-4 text-right">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              View All Matches
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;