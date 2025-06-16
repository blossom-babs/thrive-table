import { useMemo } from "react";

import "./App.css";
import generateUserData from "./utils/generateData";
import DataTable from "./components/DataTable";

function App() {
  const data = useMemo(() => generateUserData(500), []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Data Table</h1>
      <DataTable data={data} />
    </div>
  );
}

export default App;
