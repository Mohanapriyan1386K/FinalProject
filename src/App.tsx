import "./App.css";
import { ToastContainer } from "react-toastify";
import AppRouterProvider from "./Router/MainRoute";

function App() {
  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
       <AppRouterProvider/>
    </div>
  );
}

export default App;
