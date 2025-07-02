import "./App.css";
import { ToastContainer } from "react-toastify";
import AppRouterProvider from "./Router/MainRoute";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div>
    <ToastContainer autoClose={1000} />
      <AppRouterProvider />
    </div>
  );
}

export default App;
