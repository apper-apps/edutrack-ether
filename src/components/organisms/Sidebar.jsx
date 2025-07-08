import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Students", path: "/students", icon: "Users" },
    { name: "Classes", path: "/classes", icon: "BookOpen" },
    { name: "Grades", path: "/grades", icon: "GraduationCap" },
    { name: "Attendance", path: "/attendance", icon: "Calendar" },
    { name: "Reports", path: "/reports", icon: "FileText" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
            <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">EduTrack Pro</h1>
            <p className="text-xs text-gray-500">Student Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
              )
            }
          >
            <ApperIcon 
              name={item.icon} 
              className={cn(
                "h-5 w-5 mr-3 transition-colors",
                location.pathname === item.path
                  ? "text-white"
                  : "text-gray-500 group-hover:text-primary-600"
              )}
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
<div className="p-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Admin User'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.emailAddress || 'School Administrator'}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="w-full"
        >
          <ApperIcon name="LogOut" className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-64 h-full"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;