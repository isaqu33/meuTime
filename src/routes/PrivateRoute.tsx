import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { userAltentication } from "../redux/sliceAltentication";

export default function PrivateRoute({ rout }: any) {
  const dataAltentication = useSelector(userAltentication);

  // return rout;

  switch (dataAltentication.isLogged) {
    case true:
      return rout;

    case false:
      return <Navigate to="/login" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
}
