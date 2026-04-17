
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.jpg";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.users);

  const userMenu = [
    {
      name: "Home",
      path: "/easy-booking",
      icon: "ri-home-line",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/easy-booking",
      icon: "ri-home-line",
    },
    {
      name: "Buses",
      path: "/admin/buses",
      icon: "ri-bus-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line",
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const menutoBeRendered = user?.isAdmin ? adminMenu : userMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("book-now")) {
    activeRoute = "/easy-booking";
  }

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar */}
      <div className={`h-screen sticky top-0 flex flex-col bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        {/* Collapse toggle */}
        <div className="flex justify-end p-4">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? (
              <i className="ri-menu-2-fill text-2xl"></i>
            ) : (
              <i className="ri-menu-fold-line text-2xl"></i>
            )}
          </button>
        </div>
        
        {/* User profile */}
        <div className={`flex ${collapsed ? 'justify-center' : 'px-6'} py-4 border-b border-gray-700`}>
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">{user?.name}</h3>
                <p className="text-gray-400 text-xs truncate max-w-[160px]">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation menu */}
        <div className="flex flex-col py-6 flex-1 overflow-y-auto">
          {menutoBeRendered.map((item, key) => {
            const isActive = activeRoute === item.path;
            return (
              <button
                key={key}
                className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start px-6'} py-3 my-1 mx-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => {
                  if (item.path === "/logout") {
                    localStorage.clear();
                    navigate("/");
                  } else {
                    navigate(item.path);
                  }
                }}
              >
                <i className={`${item.icon} text-xl ${collapsed ? '' : 'mr-3'}`}></i>
                {!collapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
                {isActive && !collapsed && (
                  <span className="ml-auto">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* App branding */}
        <div className={`p-4 border-t border-gray-700 flex ${collapsed ? 'justify-center' : 'px-6'}`}>
          <div 
            className={`flex items-center cursor-pointer ${collapsed ? '' : 'space-x-2'}`}
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Easy-Booking" className="w-8 h-8 rounded-full object-cover" />
            {!collapsed && (
              <span className="font-bold text-white">Bus-Ticket-Booking</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-3 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              {menutoBeRendered.find(item => item.path === activeRoute)?.name || 'Dashboard'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <i className="ri-notification-3-line text-xl"></i>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                  <span className="text-sm font-medium">{user?.isAdmin ? 'Admin' : 'User'}</span>
                  <i className="ri-arrow-down-s-line"></i>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;