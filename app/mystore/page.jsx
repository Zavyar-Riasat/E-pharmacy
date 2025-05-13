"use client";
import React, { useState, useEffect } from "react";
import PopupForm from "../mystorepopup/page";

function AllProduct({ user }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://681f51fa72e59f922ef5e692.mockapi.io/api/products");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 useEffect(() => {
  if (searchTerm.trim() === "") {
    setFilteredProducts(products);
  } else {
    const filtered = products.filter(product => {
      // Convert both ID and name to strings for safe comparison
      const idString = String(product.id).toLowerCase();
      const nameString = String(product.name).toLowerCase();
      const searchString = searchTerm.toLowerCase();
      
      return idString.includes(searchString) || 
             nameString.includes(searchString);
    });
    setFilteredProducts(filtered);
  }
}, [searchTerm, products]);
  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('https://681f51fa72e59f922ef5e692.mockapi.io/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const newProduct = await response.json();
      
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setShowPopup(false);
      setSubmitStatus("Product added successfully!");
      setTimeout(() => setSubmitStatus(null), 3000);

    } catch (error) {
      console.error("Error submitting data:", error);
      setSubmitStatus("Error submitting product. Please try again.");
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowEditPopup(true);
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await fetch(`https://681f51fa72e59f922ef5e692.mockapi.io/api/products/${currentProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const updatedProduct = await response.json();
      
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === currentProduct.id ? updatedProduct : product
        )
      );
      
      setShowEditPopup(false);
      setSubmitStatus("Product updated successfully!");
      setTimeout(() => setSubmitStatus(null), 3000);

    } catch (error) {
      console.error("Error updating product:", error);
      setSubmitStatus("Error updating product. Please try again.");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await fetch(`https://681f51fa72e59f922ef5e692.mockapi.io/api/products/${productId}`, {
        method: 'DELETE',
      });

      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productId)
      );
      
      setSubmitStatus("Product deleted successfully!");
      setTimeout(() => setSubmitStatus(null), 3000);

    } catch (error) {
      console.error("Error deleting product:", error);
      setSubmitStatus("Error deleting product. Please try again.");
    }
  };

  const productFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "price", label: "Price", type: "text" },
    { name: "stock", label: "Stock", type: "text" },
    { name: "bgimages", label: "Image URL", type: "text" }
  ];

  return (
    <section className="py-8 bg-[#343148FF]">
      <div className="container px-4 mx-auto">
        {submitStatus && (
          <div className={`mb-4 p-3 rounded-md ${
            submitStatus.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
            {submitStatus}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <button
            onClick={() => setShowPopup(true)}
            className="bg-[#D7C49EFF] hover:border-2 border-[#D7C49EFF] px-5 py-3 text-white rounded-md text-xs font-semibold cursor-pointer w-full md:w-auto"
          >
            Add New Product
          </button>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by ID or name..."
              className="w-full px-4 py-2 rounded-md border bg-[#D7C49EFF] border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D7C49EFF]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className={`${showPopup || showEditPopup ? "w-full md:w-2/3" : "w-full"}`}>
            <div className="p-4 mb-6 bg-white shadow rounded overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[#D7C49EFF] shadow-md rounded-lg overflow-hidden divide-y divide-gray-400 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-center">
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-center">
                        {searchTerm ? "No products match your search" : "No products found"}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#343148FF] hover:text-white hover:font-bold">
                        <td className="px-4 py-2">
                          <img
                            src={product.bgimages || "./img/image.png"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md" 
                          />
                        </td>
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2 font-semibold">${product.price}</td>
                        <td className="px-4 py-2 font-semibold">{product.stock}</td>
                        <td className="px-4 py-2 text-xs">{product.id}</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showPopup && (
            <div className="w-full md:w-1/3">
              <div className="bg-white p-4 rounded-lg shadow-lg sticky top-20">
                <PopupForm
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  fields={productFields}
                  onSubmit={handleSubmit}
                  title="Add New Product"
                />
              </div>
            </div>
          )}

          {showEditPopup && currentProduct && (
            <div className="w-full md:w-1/3">
              <div className="bg-white p-4 rounded-lg shadow-lg sticky top-20">
                <PopupForm
                  showPopup={showEditPopup}
                  setShowPopup={setShowEditPopup}
                  fields={productFields}
                  onSubmit={handleUpdate}
                  title="Edit Product"
                  initialData={currentProduct}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AllProduct;