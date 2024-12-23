import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Ticket, Menu } from "lucide-react";
import { LogoutThunk } from "../../../redux/thunk/authThunk";

const AdminHeader = ({ onSidebarOpen }) => {
  const { userID } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(LogoutThunk());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-6">
        <div className="flex h-16 items-center">
          <button
            onClick={onSidebarOpen}
            className="mr-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2 lg:hidden">
            <Ticket className="h-8 w-8 text-blue-600" />
            <Link to="/" className="text-xl font-bold text-gray-900">
              TicketMate
            </Link>
          </div>

          <div className="ml-auto">
            {userID ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                    flex items-center justify-center text-white font-medium hover:ring-2 
                    hover:ring-blue-300 transition-all"
                  >
                    A
                  </div>
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 
                    z-50 border border-gray-200"
                  >
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 
                        hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
