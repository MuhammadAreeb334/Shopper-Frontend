import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Edit,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
  Calendar,
} from "lucide-react";
import { FireAPI } from "../../../hooks/useRequest.js";
import { baseUrl } from "../../../hooks/useRequest.js";

const ListProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await FireAPI(`api/products`, "GET");
        if (data && data.success) {
          setProducts(data.allProducts);
        } else {
          toast.error("Failed to fetch Product");
        }
        // console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        const token = sessionStorage.getItem("token");
        await FireAPI(`api/products/${productId}`, "DELETE", null, token);
        setProducts(products.filter((product) => product._id !== productId));
        toast.success(`${productName} deleted successfully!`);
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Error deleting product. Please try again.");
      }
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  // Toggle availability This need to be completed.
  // const handleToggleAvailability = async (productId, currentStatus) => {
  //   try {
  //     // Replace with your actual API call
  //     // await fetch(`/api/products/${productId}/toggle-availability`, {
  //     //   method: 'PATCH',
  //     //   headers: { 'Content-Type': 'application/json' },
  //     //   body: JSON.stringify({ available: !currentStatus })
  //     // });

  //     // Update local state
  //     setProducts(
  //       products.map((product) =>
  //         product._id === productId
  //           ? { ...product, available: !currentStatus }
  //           : product,
  //       ),
  //     );
  //   } catch (error) {
  //     console.error("Error toggling availability:", error);
  //     toast.error("Error updating product status");
  //   }
  // };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && product.available) ||
      (availabilityFilter === "unavailable" && !product.available);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get category color for gradient
  const getCategoryColor = (category) => {
    const colors = {
      women: "from-pink-500 to-pink-600",
      men: "from-blue-500 to-blue-600",
      kid: "from-green-500 to-green-600",
    };
    return colors[category] || "from-gray-500 to-gray-600";
  };

  // Calculate discount percentage
  const getDiscountPercentage = (newPrice, oldPrice) => {
    if (oldPrice > newPrice) {
      return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    }
    return 0;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setAvailabilityFilter("all");
    setCurrentPage(1);
  };

  // Get stats
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;

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
    <div className="bg-white rounded-md shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Product List
            </h2>
            <p className="text-gray-500 mt-1">Manage all your products</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
              />
            </div>

            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Filter size={18} />
              <span>Filter</span>
              {(selectedCategory !== "all" ||
                availabilityFilter !== "all" ||
                searchTerm) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {totalProducts}
                </p>
              </div>
              <Package className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Available Products
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {availableProducts}
                </p>
              </div>
              <Tag className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <X size={14} /> Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Categories</option>
                <option value="womens">Women</option>
                <option value="mens">Men</option>
                <option value="kids">Kids</option>
              </select>

              {/* <select
                value={availabilityFilter}
                onChange={(e) => {
                  setAvailabilityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select> */}
            </div>
          </div>
        )}
      </div>

      {currentProducts.length > 0 ? (
        <>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className={`group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    !product.available
                      ? "opacity-75 border-gray-200"
                      : "border-gray-200"
                  }`}
                >
                  <div className="relative overflow-hidden bg-gray-100 h-64">
                    <img
                      src={product.image?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {!product.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Unavailable
                        </span>
                      </div>
                    )}

                    <div
                      className={`absolute top-3 right-3 bg-gradient-to-r ${getCategoryColor(product.category)} text-white text-xs font-semibold px-3 py-1 rounded-full capitalize shadow-md`}
                    >
                      {product.category}
                    </div>

                    {getDiscountPercentage(product.newPrice, product.oldPrice) >
                      0 && (
                      <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        SAVE{" "}
                        {getDiscountPercentage(
                          product.newPrice,
                          product.oldPrice,
                        )}
                        %
                      </div>
                    )}

                    {product.image.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
                        +{product.image.length - 1} more
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                      <Calendar size={12} />
                      <span>Added {formatDate(product.date)}</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.newPrice)}
                      </span>
                      {product.oldPrice > product.newPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Status:</span>
                      <button
                        onClick={() =>
                          handleToggleAvailability(
                            product._id,
                            product.available,
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          product.available ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            product.available
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div> */}

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <Package size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ||
            selectedCategory !== "all" ||
            availabilityFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Start adding products to your store"}
          </p>
          {(searchTerm ||
            selectedCategory !== "all" ||
            availabilityFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <X size={16} /> Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ListProduct;
