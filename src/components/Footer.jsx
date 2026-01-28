import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Github, MapPin, Phone, Globe, Heart } from 'lucide-react';
import { THEME, THEME_CLASSES } from '../theme';

/**
 * Footer - Modern redesigned footer with enhanced layout and styling
 */
export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-3">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-3">
            {/* Brand Section - Expanded */}
            <div className="lg:col-span-2">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    S
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                    Skilltera
                  </h3>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed mb-3 max-w-md">
                  Connecting talented professionals with their dream careers.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-slate-900 flex items-center gap-1">
                <div className="w-0.5 h-4 bg-primary-500 rounded-full"></div>
                Quick Links
              </h4>
              <ul className="space-y-1">
                <li>
                  <Link to="/jobs-search" className="text-slate-600 hover:text-primary-600 transition-all duration-200 flex items-center gap-1 group text-xs">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Search Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 transition-all duration-200 flex items-center gap-1 group text-xs">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    My Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-slate-600 hover:text-primary-600 transition-all duration-200 flex items-center gap-1 group text-xs">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/companies" className="text-slate-600 hover:text-primary-600 transition-all duration-200 flex items-center gap-1 group text-xs">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Top Companies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-slate-900 flex items-center gap-1">
                <div className="w-0.5 h-4 bg-primary-500 rounded-full"></div>
                Resources
              </h4>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-slate-600 hover:text-primary-600 transition-all duration-200 flex items-center gap-1 group text-xs">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Career Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-primary-600 transition-all duration-200 flex items-center gap-1 group text-xs">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Resume Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-primary-600 transition-all duration-200 flex items-center gap-1 group text-xs">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Interview Prep
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-primary-600 transition-all duration-200 flex items-center gap-1 group text-xs">
                    <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Salary Insights
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-slate-900 flex items-center gap-1">
                <div className="w-0.5 h-4 bg-primary-500 rounded-full"></div>
                Connect
              </h4>
              
              {/* Contact Info */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3 h-3 text-primary-500" />
                  <span className="text-xs">hello@skilltera.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3 h-3 text-primary-500" />
                  <span className="text-xs">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3 h-3 text-primary-500" />
                  <span className="text-xs">San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                <a href="#" className="w-7 h-7 bg-white border border-slate-200 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110">
                  <Linkedin size={14} className="text-slate-600 group-hover:text-white" />
                </a>
                <a href="#" className="w-7 h-7 bg-white border border-slate-200 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110">
                  <Twitter size={14} className="text-slate-600 group-hover:text-white" />
                </a>
                <a href="#" className="w-7 h-7 bg-white border border-slate-200 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110">
                  <Github size={14} className="text-slate-600 group-hover:text-white" />
                </a>
                <a href="#" className="w-7 h-7 bg-white border border-slate-200 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group hover:scale-110">
                  <Globe size={14} className="text-slate-600 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 py-2">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <span>&copy; 2024 Skilltera. All rights reserved.</span>
              <span className="hidden lg:inline">•</span>
              <span className="flex items-center gap-0.5">
                Made with <Heart className="w-2 h-2 text-red-500 fill-current" /> for job seekers
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3 text-xs">
              <a href="#" className="text-slate-500 hover:text-primary-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-primary-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-500 hover:text-primary-600 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-primary-600 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
