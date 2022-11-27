import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AdminSignin from "./components/AdminSigin";
import VendorSignin from "./components/VendorSignin";
import VendorSignup from "./components/VendorSignup";
import AdminHome from "./components/AdminHome";
import AdminUploadTender from "./components/AdminUploadTender";
import AdminViewTender from "./components/AdminViewTender";
import VendorUploadTender from "./components/VendorUploadTender";
import AdminRemoveFlights from "./components/AdminRemoveFlights";
import VendorTenderDetails from "./components/VendorTenderDetails";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdminAddFlight from "./components/AdminAddFlight";
import HowToUse from "./components/HowToUse";
import { ConfirmProvider } from 'material-ui-confirm';


function App() {
  return (
    <ConfirmProvider>
    <Router>
      <div className="App">
        <Routes>
        
          <Route path="/admin/addFlight" exact element={<AdminAddFlight />} />
    
          <Route path="/" exact element={<Home />} />
          <Route path="/admin/signin" exact element={<AdminSignin />} />
          <Route path="/vendor/signin" exact element={<VendorSignin />} />
          <Route path="/vendor/signup" exact element={<VendorSignup />} />
          <Route path="forgotPassword" exact element={<ForgotPassword />} />
          {/* <Route path="/reset_password" exact element={<ResetPassword />} /> */}
          <Route path="/howtouse" exact element={<HowToUse />} />


          <Route path="/admin/home" exact element={<AdminHome />} />
          <Route path="/admin/uploadtender" exact element={<AdminUploadTender />} />
          <Route path="/admin/viewtender" exact element={<AdminViewTender />} />
          <Route path="/admin/removeFlights" exact element={<AdminRemoveFlights />} />


          <Route path="/vendor/uploadtender" exact element={<VendorUploadTender />} />

          <Route path="/vendor/uploadtender/tender" exact element={<VendorTenderDetails />} />
          
        </Routes>
      </div>
    </Router>
    </ConfirmProvider>
  );
}

export default App;
