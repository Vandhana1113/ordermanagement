import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const path = location.pathname;

  const crumbs = [
    { label: "Summary", to: "/" },
    { label: "Create Order", to: "/create" },
    { label: "Return Order", to: "/return" },
  ];

  return (
    <nav className="text-sm mb-6 text-gray-600 flex justify-start space-x-2">
      {crumbs.map((crumb, idx) => {
        const isActive = path === crumb.to;

        return (
          <div key={crumb.to} className="flex items-center">
            {idx > 0 && <span className="mx-2">/</span>}
            <Link
              to={crumb.to}
              className={`hover:underline ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-500"
              }`}
            >
              {crumb.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
