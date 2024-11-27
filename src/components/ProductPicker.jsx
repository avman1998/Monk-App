import React from "react";
import { X } from "lucide-react";
import Product from "./Product";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import "../styles/Modal.css";

const ProductPicker = ({
  activeProductId,
  openDrawer,
  setOpenDrawer,
  addedProducts,
  setAddedProducts,
}) => {
  const [, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeoutRef = useRef(null);

  if (!openDrawer) return null; // Don't render anything if the modal is closed.
  const totalProductsSelected = filteredProducts?.reduce((acc, curr) => {
    if (curr.selected == true) acc++;
    return acc;
  }, 0);
  async function fetchData(page, query) {
    try {
      const url = query
        ? `https://stageapi.monkcommerce.app/task/products/search?search=${query}&page=${page}&limit=10`
        : `https://stageapi.monkcommerce.app/task/products/search?page=${page}&limit=10`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": "72njgfa948d9aS7gs5",
        },
        redirect: "follow",
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse the JSON response
      if (data?.length === 0 || !data) setHasMore(false);
      else {
        if (page === 1) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          setProducts((prev) => [...prev, ...data]);
          setFilteredProducts((prev) => [...prev, ...data]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    if (searchQuery === "") fetchData(page);
    else {
      fetchData(page, searchQuery);
    }
  }, [page, searchQuery]);

  function handleScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight && hasMore) setPage((prev) => prev + 1);
  }

  function addProducts() {
    const newArr = filteredProducts
      .map((item) => {
        if (item.selected === true) {
          return {
            ...item,
            variants: item.variants.filter((v) => v.selected),
          };
        }
      })
      .filter((item) => item != undefined);
    let updatedProducts = [...addedProducts];

    const addedProductsId = updatedProducts.map((item) => item.id);

    const displayProductList = newArr.filter(
      (item) => !addedProductsId.includes(item.id)
    );
    if (displayProductList.length > 0)
      updatedProducts.splice(activeProductId, 1, ...displayProductList);
    else updatedProducts = [...newArr];

    setAddedProducts((prev) => {
      return updatedProducts;
    });
    setOpenDrawer(false);
    setTimeout(() => {
      if (displayProductList.length !== newArr.length) {
        toast("Some selected products have already been added to the list.");
      }
    }, 0);
  }

  // Debounced Search Handler
  const handleSearchProduct = useCallback((e) => {
    const { value } = e.target;
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value.trim());
      setPage(1);
    }, 300); // Adjust debounce time (300ms)
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
      <div className="relative flex flex-col bg-white w-[800px] h-[500px] border border-black p-3 gap-3">
        <div className="flex justify-between items-center ">
          <p className="font-bold">Select Products</p>
          <button onClick={() => setOpenDrawer(false)}>
            <X />
          </button>
        </div>
        <hr />
        <input
          type="text"
          name=""
          id=""
          onChange={handleSearchProduct}
          // value={searchQuery}
          placeholder="Select product"
          className="w-full p-2 border border-gray"
        />

        {filteredProducts?.length > 0 ? (
          <div className="overflow-y-auto" onScroll={handleScroll}>
            {filteredProducts?.map((prod) => {
              return (
                <Product
                  data={prod}
                  setFilteredProducts={setFilteredProducts}
                />
              );
            })}
          </div>
        ) : (
          <p>Loading....</p>
        )}

        <div className=" sticky bg-white bottom-0 flex gap-3 p-3 justify-between z-10 items-center ">
          {totalProductsSelected >= 0 && (
            <p>{totalProductsSelected} product selected</p>
          )}
          <div className="flex gap-4">
            <button
              className="border border-black rounded"
              onClick={() => setOpenDrawer(false)}
            >
              Cancel
            </button>
            <button
              className="text-white rounded bg-[#008060]"
              onClick={() => addProducts()}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
