import React, { useState } from "react";
import { X,GripVertical } from "lucide-react";
function ProductList({
  setOpenDrawer,
  addedProducts,
  setAddedProducts,
  setActiveProductId,
}) {
  const [isVariantsVisible, setIsVariantsVisible] = useState({});
  const [discountVisible, setDiscountVisible] = useState({});
  const [productDraggedIndex,setProductDraggedIndex]=useState(null);
  const [variantDraggedIndex,setVariantDraggedIndex]=useState(null);
  const handleAddProduct = () => {
    setAddedProducts((prev) => [
      ...prev,
      {
        
      },
    ]);
  };

  function handleShowVariants(id) {
    setIsVariantsVisible((prev) => {
      if (prev[id] !== undefined) {
        return {
          ...prev,
          [id]: !prev[id],
        };
      } else {
        return {
          ...prev,
          [id]: true,
        };
      }
    });
  }

  function handleShowDiscountFields(id) {
    setDiscountVisible((prev) => {
      if (prev[id] !== undefined) {
        return {
          ...prev,
          [id]: !prev[id],
        };
      } else {
        return {
          ...prev,
          [id]: true,
        };
      }
    });
  }

  function handleVariantDelete(product_id, variant_id, product_index) {
    setAddedProducts((prev) => {
      const productsArray = [...prev];
      const myProduct = productsArray[product_index];
      const updatedVariants = myProduct?.variants?.filter(
        (v) => v.id !== variant_id
      );
      productsArray[product_index] = {
        ...myProduct,
        variants: [...updatedVariants],
      };
      return [...productsArray];
    });
  }

  function handleProductDelete(id) {
    setAddedProducts((prev) => {
      const products = prev.filter((product,index) => index !== id);
      return [...products]
    });
  }

  function handleProductDragStart(index){
    setProductDraggedIndex(index)
  }

  function handleVariantDragStart(index){
    setVariantDraggedIndex(index)
  }


  function handleDragOver(e){
    e.preventDefault();
  }


  function handleProductDrop(index){
   const updatedProducts=[...addedProducts];
   const [draggedItem]=updatedProducts.splice(productDraggedIndex,1);
   updatedProducts.splice(index,0,draggedItem);
   setAddedProducts(updatedProducts)
   setProductDraggedIndex(null)
  }

  function handleVariantDrop(product_index,variant_index){
   const updatedProducts=[...addedProducts];
   const [draggedItem]=updatedProducts[product_index].variants.splice(variantDraggedIndex,1);
   updatedProducts[product_index].variants.splice(variant_index,0,draggedItem);
   setAddedProducts(updatedProducts);
   setVariantDraggedIndex(null)
  }

  return (
    <>
  <p className="font-bold text-3xl">Add products</p>
  <div className="flex mx-2 my-8 gap-6 flex-col max-w-[900px]">
    {addedProducts?.map((product, index) => (
      <div
        key={index}
        draggable
        onDragStart={() => handleProductDragStart(index)}
        onDragOver={handleDragOver}
        onDrop={() => handleProductDrop(index)}
      >
        <div className="flex m-2 gap-6 items-start">
          <button className="bg-white border-0 focus:ring-0 border-radius-none">
            <GripVertical />
          </button>
          <span>{index + 1}.</span>
          <div className="flex flex-col gap-3 flex-1">
            <label htmlFor="product">Product</label>
            <div className="flex">
              <div className="flex justify-between items-center border border-gray p-2 w-[500px]">
                <p>{product?.title || ""}</p>
                <p
                  className="bg-white border-0 focus:ring-0 border-radius-none cursor-pointer"
                  onClick={() => {
                    setOpenDrawer(true);
                    setActiveProductId(index);
                  }}
                >
                  ✒️
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {discountVisible[product?.id] ? (
              <div className="flex justify-center items-center gap-4 mt-10">
                <input
                  type="number"
                  name=""
                  id=""
                  className="border border-gray p-2"
                />
                <select
                  name=""
                  id=""
                  className="border border-gray p-2 h-[42px]"
                >
                  <option value="">% off</option>
                  <option value="">Flat off</option>
                </select>
              </div>
            ) : (
              <>
                <label htmlFor="">Discount</label>
                <button
                  className="text-white bg-[#008060] rounded-none w-[200px]"
                  onClick={() => handleShowDiscountFields(product.id)}
                >
                  Add Discount
                </button>
              </>
            )}
            {product?.variants?.length > 0 && (
              <div
                className="flex justify-end text-blue-700 cursor-pointer"
                onClick={() => handleShowVariants(product?.id)}
              >
                {isVariantsVisible[product?.id]
                  ? "Hide variants"
                  : "Show variants"}
              </div>
            )}
          </div>
          {addedProducts.length > 1 && (
            <button
              onClick={() => handleProductDelete(index)}
              className="rounded-none bg-white border-0 mt-9"
            >
              <X />
            </button>
          )}
        </div>
        {isVariantsVisible[product?.id] &&
          product?.variants?.length > 0 &&
          product?.variants?.map((v, v_index) => (
            <div
              key={v_index}
              className="flex gap-3 m-2 ml-10"
              draggable
              onDragOver={handleDragOver}
              onDragStart={() => handleVariantDragStart(v_index)}
              onDrop={() => handleVariantDrop(index, v_index)}
            >
              <button className="bg-white border-0 focus:ring-0 border-radius-none">
                <GripVertical />
              </button>
              <div className="ml-10 rounded-3xl bg-white w-[450px] border border-gray p-3">
                {v.title}
              </div>
              <div className="flex justify-center items-center gap-4">
                <input
                  type="number"
                  name=""
                  id=""
                  className="border border-gray p-2 w-[80px]"
                />
                <select
                  name=""
                  id=""
                  className="border border-gray p-2 h-[42px]"
                >
                  <option value="">% off</option>
                  <option value="">Flat off</option>
                </select>
              </div>
              {product?.variants?.length > 1 && (
                <button
                  onClick={() =>
                    handleVariantDelete(product.id, v.id, index)
                  }
                  className="rounded-none bg-white border-0"
                >
                  <X />
                </button>
              )}
            </div>
          ))}
      </div>
    ))}
    <div className="flex flex-end flex-row-reverse">
      <button
        onClick={handleAddProduct}
        className="border border-[#008060] bg-gray text-[#008060] rounded-none"
      >
        Add Product
      </button>
    </div>
  </div>
</>


  );
}

export default ProductList;
