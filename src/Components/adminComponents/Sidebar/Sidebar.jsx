import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, List } from 'lucide-react';

const Sidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 p-4 rounded-lg font-medium transition-all ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-500 hover:bg-gray-100'
    }`;

  return (
    <div className="w-full lg:w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="h-full py-6 px-4">
        <div className="flex flex-col gap-2 sticky top-0">
          <NavLink to="add-product" className={navLinkClass}>
            <ShoppingCart size={24} />
            <span>Add Product</span>
          </NavLink>

          <NavLink to="list-product" className={navLinkClass}>
            <List size={24} />
            <span>Product List</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;