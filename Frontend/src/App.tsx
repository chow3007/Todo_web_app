import { Route, Routes} from "react-router-dom";
import Task from "./pages/TaskBoardPage";
import TaskTable from "./pages/TaskTablePage";

function App() {
 
  return (
    <>
      <Routes>
        <Route path="/" element={<Task/>}/>
        <Route path="/task" element={<TaskTable/>}/>
      </Routes>
    </>
  );
}

export default App;