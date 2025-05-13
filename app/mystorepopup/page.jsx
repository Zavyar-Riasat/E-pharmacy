"use client";
import React, { useState } from "react";

const PopupForm = ({ showPopup, setShowPopup, fields, onSubmit, title }) => {
  const [imageurl, setImageurl] = useState([]);

  const [formData, setFormData] = useState(() => {
    const initialData = {};
    if (Array.isArray(fields)) {
      fields.forEach((field) => {
        initialData[field.name] = field.defaultValue || "";
      });
    }
    // Initialize potencies
    if (!initialData.potencies) {
      initialData.potencies = [{ strength: "", price: "" }];
    }
    return initialData;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file));

    if (fileURLs.length === 4) {
      setImageurl(fileURLs);
    } else {
      alert("Please upload exactly 4 images.");
    }
  };

  const handlePotencyChange = (index, field, value) => {
    const updatedPotencies = [...formData.potencies];
    updatedPotencies[index][field] = value;
    setFormData((prevState) => ({
      ...prevState,
      potencies: updatedPotencies,
    }));
  };

  // const addPotency = () => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     potencies: [...prevState.potencies, { strength: "", price: "" }],
  //   }));
  // };

  // const removePotency = (index) => {
  //   const updatedPotencies = [...formData.potencies];
  //   updatedPotencies.splice(index, 1);
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     potencies: updatedPotencies,
  //   }));
  // };

  const handleSubmit = () => {
    onSubmit({ ...formData, images: imageurl }); // include images
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0  bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>

        {/* Dynamic input fields */}
        {fields.map((field) => (
          <div className="mb-4" key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={field.placeholder || ""}
            />
          </div>
        ))}

        {/* Potency fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Potencies
          </label>
          {formData.potencies.map((potency, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 mb-2 animate-fade-in"
            >
              <input
                type="text"
                placeholder="Strength (e.g. 500mg)"
                value={potency.strength}
                onChange={(e) =>
                  handlePotencyChange(index, "strength", e.target.value)
                }
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={potency.price}
                onChange={(e) =>
                  handlePotencyChange(index, "price", e.target.value)
                }
                className="w-1/2 p-2 border rounded"
              />
              {/* {formData.potencies.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePotency(index)}
                  className="text-red-500 text-sm font-semibold"
                >
                  ✕
                </button>
              )} */}
            </div>
          ))}
          {/* <button
            type="button"
            onClick={addPotency}
            className="mt-1 text-blue-600 text-sm hover:underline"
          >
            + Add Potency
          </button> */}
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload 4 Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex space-x-3 overflow-x-auto mt-3">
            {imageurl.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded-md shadow-md"
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setShowPopup(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
