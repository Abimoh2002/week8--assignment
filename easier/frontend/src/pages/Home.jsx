import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Truck, Shield, Clock, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-slate-500 rounded-full">
                <Flame className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Your Trusted
              <span className="block text-slate-600 font-normal"> Gas Delivery Partner</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Safe, reliable, and fast gas cylinder delivery across Kenya. 
              EPRA certified with 24/7 customer support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-slate-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center"
              >
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="bg-gray-300 text-gray-700 text-lg px-8 py-3 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Mobigas?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best gas delivery experience with safety, reliability, and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-slate-300 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Same-day delivery within Nairobi, next-day delivery across Kenya.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-slate-300 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">EPRA Certified</h3>
              <p className="text-gray-600">
                All our gas cylinders are EPRA certified and meet safety standards.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-slate-300 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support for all your gas delivery needs.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-slate-300 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Premium quality gas cylinders from trusted manufacturers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Mobigas for their gas delivery needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-gray-200 text-slate-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors inline-block"
            >
              Browse Products
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-gray-200 text-gray-200 font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 hover:text-slate-700 transition-colors inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 