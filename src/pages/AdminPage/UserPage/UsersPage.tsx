import React from "react";
import UserTable from "../../../components/Admin/UserTable/UserTable";
import AppLayout from "../AdminLayout";

const Users: React.FC = () => {
  return (
    <AppLayout>
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <UserTable />
      </div>
    </AppLayout>
  );
};

export default Users;