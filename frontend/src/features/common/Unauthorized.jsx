
import React from "react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md flex gap-4">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">403</h1>
        <p className="text-xl p-3 text-gray-500 font-light">Access Denied</p>
      </div>
    </div>
  );
};

export default Unauthorized;
