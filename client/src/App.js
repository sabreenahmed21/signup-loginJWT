import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Pages/Signup";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";
import Forgotpassword from "./Pages/Forgotpassword";
import Verifypassword from "./Pages/Verifypassword";
import ResetPassword from "./Pages/Resetpassword";
import Mony from "./Pages/Mony";
import PrivateRoute from "./Pages/PrivateRoute";
import EmailVerification from "./Components/EmailVerification";
import Notfound from "./Pages/Notfound";
import Profle from "./Pages/Profle";

export default function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="verify-email" element={<EmailVerification/>} />
          <Route path="/login" element={<Login />} />
          <Route  path="/forgetPassword" element={<Forgotpassword/>} />
          <Route path="/verifypassword" element={<Verifypassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword/>} /> 
          <Route path="/profilePage" element={<Profle/>} />
          <Route element={<PrivateRoute/>}>
            <Route path="/mony" element={<Mony/>}/>
          </Route>
          <Route path="*" element={<Notfound/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
