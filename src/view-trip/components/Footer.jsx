import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa"; // Import social icons

const Footer = () => {
  return (
    <footer className="relative bg-[#2C2C2C] text-white py-16">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#ff6b00"
            fillOpacity="1"
            d="M0,256L120,256C240,256,480,256,720,250.7C960,245,1200,235,1320,229.3L1440,224V320H0Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">

          {/* Brand Section */}
          <div>
            <h2 className="text-3xl font-extrabold text-orange-500">AI Trip Planner</h2>
            <p className="mt-3 text-gray-300 max-w-xs">
              Your AI-powered travel assistant. Plan smarter, travel better.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-orange-400">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              {["About Us", "Destinations", "Contact", "FAQs"].map((link, index) => (
                <li key={index}>
                  <a href="#" className="relative inline-block text-gray-300 hover:text-orange-400 transition duration-300">
                    {link}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-orange-400">Subscribe</h3>
            <p className="mt-2 text-gray-400">Stay updated with the latest travel trends.</p>
            <div className="mt-4 flex items-center">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-2 rounded-l-lg bg-gray-700 text-white outline-none"
              />
              <button className="px-4 py-2 bg-orange-500 rounded-r-lg hover:bg-orange-600 transition">
                Subscribe
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-orange-400">Follow Us</h3>
            <div className="flex space-x-5 mt-4">
              <a href="#" className="text-2xl text-blue-500 hover:text-blue-400 hover:scale-110 transition duration-300">
                <FaFacebookF />
              </a>
              <a href="#" className="text-2xl text-pink-500 hover:text-pink-400 hover:scale-110 transition duration-300">
                <FaInstagram />
              </a>
              <a href="#" className="text-2xl text-cyan-400 hover:text-cyan-300 hover:scale-110 transition duration-300">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-500 my-10"></div>

        {/* Copyright */}
        <div className="text-center text-white text-sm">
          © {new Date().getFullYear()} AI Trip Planner. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;