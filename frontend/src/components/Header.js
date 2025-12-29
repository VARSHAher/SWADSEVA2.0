import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Header = ({ user, onLogout, isAdmin, searchQuery, setSearchQuery, menuItems }) => {  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const searchBarRef = useRef(null);

  const handleSignOut = () => {
    onLogout();
    toast.info("You have been signed out.");
    navigate("/auth");
  };

 
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  return (
    <header className="flex items-center justify-between py-[18px] px-[80px] sticky top-0 bg-[#f0fdf4] border-b border-[#bbf7d0] z-50">

  <div className="flex items-center gap-3">
    <img
      src="https://img.freepik.com/premium-vector/vector-vibrant-healthy-bowl-filled-with-variety-fresh-vegetables_410516-100256.jpg"
      alt="SwadSeva Logo"
      className="w-[48px] h-[48px] rounded-full object-cover ring-2 ring-[#86efac]"
    />
    <span className="text-[1.6rem] font-extrabold text-[#14532d]">
      Swad<span className="text-[#16a34a]">Seva</span>
    </span>
  </div>

  <nav>
    <ul className="flex gap-[34px]">
      {[
        { label: isAdmin ? "DASHBOARD" : "HOME", path: "/" },
        { label: isAdmin ? "CUSTOMER ORDERS" : "ABOUT", path: "/about" },
        { label: "MENU", path: "/menu" },
        { label: isAdmin ? "CREATE MENU" : "ORDERS", path: isAdmin ? "/admin/create-menu" : "/orders" },
        { label: isAdmin ? "ENQUIRY" : "CONTACT", path: "/contact" },
      ].map((item, i) => (
        <li key={i} className="relative group">
          <Link
            to={item.path}
            className="font-semibold text-[14.5px] text-[#14532d] transition"
          >
            {item.label}
          </Link>
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] 
          bg-[#16a34a] transition-all duration-300 group-hover:w-full"></span>
        </li>
      ))}
    </ul>
  </nav>


<div className="flex items-center gap-4">
    <div className="relative" ref={searchBarRef}>
      <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#16a34a]"></i>
      <input
        type="text"
        placeholder="Search food..."
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={() => setShowResults(searchQuery.length > 0)}
        className="pl-10 pr-4 py-2 rounded-full 
        border border-[#86efac] focus:outline-none
        focus:ring-2 focus:ring-[#16a34a]"
      />

      {showResults && searchQuery.length > 0 && (
        <div className="absolute top-full mt-2 w-full 
        bg-white border border-[#bbf7d0] rounded-xl shadow-lg z-[999]">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <Link
                key={item._id}
                to={`/menu?q=${item.name}`}
                onClick={() => setShowResults(false)}
                className="flex items-center gap-3 p-3 hover:bg-[#f0fdf4]"
              >
                <img src={item.image} className="w-10 h-10 rounded-md" />
                <div>
                  <p className="font-semibold text-[#14532d]">{item.name}</p>
                  <p className="text-sm text-[#16a34a]">₹{item.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              No food found 😕
            </div>
          )}
        </div>
      )}
    </div>

    {!isAdmin && (
          <Link
            to="/cart"
            id="cart-icon" 
            className="p-2 rounded-full bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#166534] transition transform hover:scale-110"
            title="Cart"
          >
            <i className="fas fa-cart-shopping text-[18px]"></i>
          </Link>
        )}

    {/* AUTH */}
    {user ? (
      <>
        <span className="text-[#14532d] font-medium">
          Hi, {user.username}
        </span>
        <button
          onClick={handleSignOut}
          className="bg-[#16a34a] hover:bg-[#15803d]
          text-white px-5 py-2 rounded-full font-semibold transition"
        >
          Sign Out
        </button>
      </>
    ) : (
      <Link
        to="/auth"
        className="bg-[#16a34a] hover:bg-[#15803d]
        text-white px-5 py-2 rounded-full font-semibold transition"
      >
        Sign In
      </Link>
    )}
  </div>
</header>



  );
};

export default Header;
