import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate, data } from "react-router-dom";
import { X, Plus, ArrowLeft, Save, Trash2 } from "lucide-react";
import { FireAPI, baseUrl } from "../../../hooks/useRequest";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    newPrice: "",
    oldPrice: "",
    category: "womens",
    available: true,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await FireAPI(`api/products/${id}`, "GET");
        // console.log(data);
        if (data && data.success) {
          const product = data.product;
          setProductDetails({
            name: product.name,
            newPrice: product.newPrice.toString(),
            oldPrice: product.oldPrice.toString(),
            category: product.category,
            available: product.available,
          });
          setExistingImages(product.image || []);
        } else {
          toast.error("Failed to fetch product details");
          navigate("/admin/list-product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error fetching product details");
        navigate("/admin/list-product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const totalImages = existingImages.length + images.length + files.length;
      if (totalImages > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      // Add new images
      const newImages = [...images, ...files];
      setImages(newImages);
    }
  };

  const removeExistingImage = (indexToRemove) => {
    const removedImage = existingImages[indexToRemove];
    setRemovedImages([...removedImages, removedImage]);
    setExistingImages(
      existingImages.filter((_, index) => index !== indexToRemove),
    );
  };

  const removeNewImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
  };

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setProductDetails({
      ...productDetails,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productDetails.name) {
      toast.error("Please enter product name");
      return;
    }
    if (existingImages.length === 0 && images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    if (!productDetails.oldPrice) {
      toast.error("Please enter old price");
      return;
    }
    if (!productDetails.category) {
      toast.error("Please select a category");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", productDetails.name);
      formData.append("newPrice", productDetails.newPrice);
      formData.append("oldPrice", productDetails.oldPrice);
      formData.append("category", productDetails.category);
      formData.append("available", productDetails.available);
      formData.append("existingImages", JSON.stringify(existingImages));
      formData.append("removedImages", JSON.stringify(removedImages));

      images.forEach((image, index) => {
        formData.append("images", image);
      });
      // console.log(sessionStorage.getItem("token"))
      const token = sessionStorage.getItem("token");
      const response = await FireAPI(
        `api/products/${id}`,
        "PATCH",
        formData,
        token,
      );
      if (response.success) {
        toast.success("Product Updated Successfully!");
        navigate("/admin/list-product");
      }

      // console.log("Product Updated:", {
      //   id,
      //   ...productDetails,
      //   existingImages,
      //   newImages: images.map((img) => img.name),
      //   removedImages,
      // });
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this product permanently?",
      )
    ) {
      try {
        const token = sessionStorage.getItem("token");
        const response = await FireAPI(`api/products/${id}`, "DELETE", null, token);
        toast.success("Product deleted successfully!");
        navigate("/admin/list-product");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Error deleting product. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-md shadow-sm">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-md shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/list-product")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Edit Product
                </h2>
                <p className="text-gray-500 mt-1">Update product information</p>
              </div>
            </div>

            <div className="hidden md:flex gap-3 ">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-gray-700 font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                value={productDetails.name}
                onChange={changeHandler}
                type="text"
                name="name"
                placeholder="Enter product name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="newPrice" className="text-gray-700 font-medium">
                  New Price (Sale Price)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    id="newPrice"
                    value={productDetails.newPrice}
                    onChange={changeHandler}
                    type="number"
                    name="newPrice"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400">Current selling price</p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="oldPrice" className="text-gray-700 font-medium">
                  Old Price (Original Price){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    id="oldPrice"
                    value={productDetails.oldPrice}
                    onChange={changeHandler}
                    type="number"
                    name="oldPrice"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                {productDetails.oldPrice && productDetails.newPrice && (
                  <p className="text-xs text-green-600">
                    Discount:{" "}
                    {Math.round(
                      ((productDetails.oldPrice - productDetails.newPrice) /
                        productDetails.oldPrice) *
                        100,
                    )}
                    % off
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-gray-700 font-medium">
                Product Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={productDetails.category}
                onChange={changeHandler}
                name="category"
                className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="womens">Women's</option>
                <option value="mens">Men's</option>
                <option value="kids">Kid's</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">
                Product Status
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={productDetails.available}
                    onChange={changeHandler}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-600">Available for sale</span>
                </label>
              </div>
              <p className="text-xs text-gray-400">
                Uncheck to hide product from store
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">
                Product Images <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Upload up to 5 images (first image will be primary)
              </p>

              <div className="flex flex-wrap gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={`${baseUrl}${imageUrl}`}
                        alt={`Existing product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1">
                        Primary
                      </span>
                    )}
                    <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-br">
                      Existing
                    </span>
                  </div>
                ))}

                {/* New Images Preview */}
                {images.map((file, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {existingImages.length === 0 && index === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1">
                        Primary
                      </span>
                    )}
                    <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-br">
                      New
                    </span>
                  </div>
                ))}

                {existingImages.length + images.length < 5 && (
                  <label htmlFor="file-input" className="cursor-pointer">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-lg hover:bg-gray-50 transition-all">
                      <Plus className="text-gray-400" size={32} />
                      <p className="text-xs text-gray-400 mt-1">Add Image</p>
                      <p className="text-xs text-gray-400">
                        {existingImages.length + images.length}/5
                      </p>
                    </div>
                  </label>
                )}
              </div>

              <input
                onChange={imageHandler}
                type="file"
                name="images"
                id="file-input"
                accept="image/*"
                multiple
                hidden
              />
              <p className="text-xs text-gray-400">
                Supported formats: JPG, PNG, GIF. Max size: 5MB each
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Product Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Product ID:</span>
                  <p className="text-gray-700 font-mono text-xs mt-1">{id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Images:</span>
                  <p className="text-gray-700">
                    {existingImages.length + images.length} / 5
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions - Mobile */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 md:hidden">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <Trash2 size={18} />
                Delete Product
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProduct;
