// import "./App.css";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Header from "./components/Header";

import { Outlet, Link } from "react-router-dom";
import { ArrowLineRight } from "phosphor-react";

// import { Link } from "@reach/router";

function App() {
  // const [count, setCount] = useState(0);


  // console.log(Link)

  return (
    <div className="w-[100%] h-[100vh] m-0  box-border flex flex-col  ">
      <Header></Header>

      <div className=" w-full flex justify-center items-center   p-6 ">
        <div className=" w-full max-w-[1300px]  flex justify-center items-center  max-[763px]:flex-wrap   ">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
