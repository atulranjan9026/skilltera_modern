import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Github, MapPin, Phone, Globe, Heart } from 'lucide-react';

/**
 * Footer - Modern redesigned footer with enhanced layout and styling
 */
export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-6">
            {/* Brand Section - Expanded */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    S
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                    Skilltera
                  </h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                  Connecting talented professionals with their dream careers. Your gateway to finding amazing job opportunities and building a successful future.
                </p>
                
                {/* Newsletter Signup */}
                {/* <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                  <h4 className="font-semibold text-white mb-3">Stay Updated</h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-lg">
                      Subscribe
                    </button>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/jobs-search" className="text-slate-300 hover:text-primary-400 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Search Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-slate-300 hover:text-primary-400 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    My Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-slate-300 hover:text-primary-400 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/companies" className="text-slate-300 hover:text-primary-400 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Top Companies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-slate-300 hover:text-primary-400 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Career Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-primary-400 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Resume Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-primary-400 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Interview Prep
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-primary-400 transition-all duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Salary Insights
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                Connect
              </h4>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-primary-400" />
                  <span className="text-sm">hello@skilltera.com</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-primary-400" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-primary-400" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-slate-700/50 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110">
                  <Linkedin size={18} className="text-slate-300 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-700/50 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110">
                  <Twitter size={18} className="text-slate-300 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-700/50 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110">
                  <Github size={18} className="text-slate-300 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-700/50 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110">
                  <Globe size={18} className="text-slate-300 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>&copy; 2024 Skilltera. All rights reserved.</span>
              <span className="hidden lg:inline">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for job seekers
              </span>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-400 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
