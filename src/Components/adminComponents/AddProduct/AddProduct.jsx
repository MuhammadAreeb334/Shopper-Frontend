import { useState } from "react";
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FireAPI } from "../../../hooks/useRequest";

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    newPrice: "",
    oldPrice: "",
    category: "womens",
    available: true,
  });

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const newImages = [...images, ...files].slice(0, 5);
      setImages(newImages);

      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviews[index]);

    setImages(newImages);
    setImagePreviews(newPreviews);
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
    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    if (!productDetails.oldPrice) {
      toast.error("Please enter original price");
      return;
    }
    if (!productDetails.category) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", productDetails.name);
      formData.append("newPrice", productDetails.newPrice);
      formData.append("oldPrice", productDetails.oldPrice);
      formData.append("category", productDetails.category);
      formData.append("available", productDetails.available);
      images.forEach((image) => {
        formData.append("images", image);
      });
      const token = sessionStorage.getItem("token");
      const response = await FireAPI("api/products", "POST", formData, token);
      if (response.success) {
        toast.success("Product added successfully!");
        setProductDetails({
          name: "",
          newPrice: "",
          oldPrice: "",
          category: "womens",
          available: true,
        });
        imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setImages([]);
        setImagePreviews([]);
        setTimeout(() => {
          navigate("/admin/list-product");
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white p-8 rounded-md shadow-sm max-w-4xl mx-auto border border-gray-100">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Add New Product
            </h2>
            <p className="text-gray-500 mt-1">
              Fill in the product details below
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="productName" className="text-gray-700 font-medium">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              value={productDetails.name}
              onChange={changeHandler}
              type="text"
              name="name"
              placeholder="Enter product title"
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
            <label className="text-gray-700 font-medium">Product Status</label>
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
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1">
                      Primary
                    </span>
                  )}
                </div>
              ))}

              {images.length < 5 && (
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-lg hover:bg-gray-50 transition-all">
                    <Plus className="text-gray-400" size={32} />
                    <p className="text-xs text-gray-400 mt-1">Add Image</p>
                    <p className="text-xs text-gray-400">{images.length}/5</p>
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

          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
