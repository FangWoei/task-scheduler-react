import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Categorys from "./Categorys";
import TasksAdd from "./TasksAdd";
import CategoryAdd from "./CategoryAdd";
import Task from "./Tasks";
import TasksEdit from "./TasksEdit";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<Categorys />} />
        <Route path="/add_category" element={<CategoryAdd />} />
        <Route path="/task/:id" element={<Task />} />
        <Route path="/add_task" element={<TasksAdd />} />
        <Route path="/task_edit/:id" element={<TasksEdit />} />
      </Routes>
    </Router>
  );
}
