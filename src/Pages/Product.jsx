import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FireAPI, baseUrl } from "../hooks/useRequest";
import BreadCrums from "../Components/BreadCrums/BreadCrums";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import toast from "react-hot-toast";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await FireAPI(`api/products/${productId}`, "GET");
        console.log("Single product data:", data);

        if (data && data.success) {
          const productData = data.product;

          const formattedProduct = {
            id: productData._id,
            name: productData.name,
            image: productData.image?.[0] || "",
            images: productData.image || [],
            new_price: productData.newPrice,
            old_price: productData.oldPrice,
            category: productData.category,
            available: productData.available,
            description: productData.description,
            date: productData.date,
          };

          setProduct(formattedProduct);
        } else {
          toast.error("Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-800">
          Product not found
        </h2>
        <p className="text-gray-500 mt-2">
          The product you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div>
      <BreadCrums product={product} />
      <ProductDisplay product={product} />
      <RelatedProducts
        currentProductId={product.id}
        currentCategory={product.category}
      />
    </div>
  );
};

export default Product;
