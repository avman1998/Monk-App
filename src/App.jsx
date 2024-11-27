import { useState } from "react";
import "./App.css";
import ProductPicker from "./components/ProductPicker";
import ProductList from "./components/ProductList";
import { ToastContainer, } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [addedProducts, setAddedProducts] = useState([]);
  const [activeProductId, setActiveProductId] = useState(null);

  return (
    <div >
      <div className="flex justify-between items-center  my-4 font-bold text-4xl border border-2 p-6 bg-[#e3f0e3] gap-3">
      <img src="https://s3.ap-south-1.amazonaws.com/assets.ynos.in/startup-logos/YNOS428022.jpg" alt="monk-commerce" width="70" />
      <p>Monk commerce admin panel</p>
      <p></p>
      </div>
     
      <ProductList
        setOpenDrawer={setOpenDrawer}
        addedProducts={addedProducts}
        setAddedProducts={setAddedProducts}
        setActiveProductId={setActiveProductId}
      />
      {openDrawer && (
        <ProductPicker
          activeProductId={activeProductId}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          addedProducts={addedProducts}
          setAddedProducts={setAddedProducts}
        />
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
        progressStyle={{
          backgroundColor: 'white',
        }}
        toastStyle={{
          backgroundColor: '#f58775',
          color: '#fff',
        }}
      />
    </div>
  );
}

export default App;
