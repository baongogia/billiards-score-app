import React from "react";
import AdminLayout from "../AdminLayout";
import MatchTable from "../../../components/Admin/MatchTable/MatchTable"

const MatchesPage = () => {
  return (
    <AdminLayout>
      <MatchTable />
    </AdminLayout>
  );
};

export default MatchesPage;