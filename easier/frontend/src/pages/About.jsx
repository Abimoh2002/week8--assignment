import React from 'react';
import { Users, Target, Award, Shield, Truck, Heart, MapPin, Phone, Mail } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-6">
            About Mobigas
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted partner in safe, reliable gas cylinder delivery across Kenya. 
            We're committed to excellence, safety, and customer satisfaction.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2018, Mobigas began with a simple mission: to make gas cylinder delivery 
                safe, reliable, and convenient for every Kenyan household and business.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                What started as a small operation in Nairobi has grown into one of Kenya's most 
                trusted gas delivery services, serving thousands of customers across the country 
                with EPRA-certified cylinders and exceptional customer service.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we continue to innovate and expand our services while maintaining the same 
                commitment to safety, quality, and customer satisfaction that has been our foundation 
                from day one.
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg p-8">
              <div className="text-center">
                <div className="bg-gray-400 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Truck className="h-12 w-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5+ Years</h3>
                <p className="text-gray-600">of reliable service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To provide safe, reliable, and convenient gas cylinder delivery services that 
                meet the highest safety standards while ensuring customer satisfaction and 
                environmental responsibility.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become Kenya's leading gas delivery service, known for innovation, 
                reliability, and commitment to safety, while expanding our reach to serve 
                every corner of the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our relationships with customers, 
              employees, and the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Safety First</h3>
              <p className="text-gray-600 text-sm">
                Every decision we make prioritizes the safety of our customers, employees, and community.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Care</h3>
              <p className="text-gray-600 text-sm">
                We treat every customer like family, providing personalized service and support.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Reliability</h3>
              <p className="text-gray-600 text-sm">
                We deliver on our promises, ensuring timely and consistent service every time.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">
                We strive for excellence in everything we do, from service quality to safety standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals who make Mobigas the trusted name in gas delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-gray-300 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Management Team</h3>
              <p className="text-gray-600 text-sm mb-3">
                Experienced leaders with decades of combined experience in logistics and customer service.
              </p>
              <div className="text-xs text-gray-500">
                • CEO & Founder<br/>
                • Operations Director<br/>
                • Customer Service Manager
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-gray-300 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery Team</h3>
              <p className="text-gray-600 text-sm mb-3">
                Professional drivers and delivery personnel trained in safety protocols and customer service.
              </p>
              <div className="text-xs text-gray-500">
                • Certified Drivers<br/>
                • Safety Officers<br/>
                • Route Planners
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-gray-300 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Safety Team</h3>
              <p className="text-gray-600 text-sm mb-3">
                Safety experts ensuring all operations meet EPRA standards and best practices.
              </p>
              <div className="text-xs text-gray-500">
                • Safety Officers<br/>
                • Quality Control<br/>
                • Compliance Team
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Certifications & Standards</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We maintain the highest standards of safety and quality through various certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-4 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">EPRA Certified</h3>
              <p className="text-gray-600 text-sm">
                All our gas cylinders meet Energy and Petroleum Regulatory Authority standards.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-4 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">ISO Standards</h3>
              <p className="text-gray-600 text-sm">
                Our operations follow international quality management standards.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-4 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600 text-sm">
                Consistently high customer satisfaction ratings and positive reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">
            Get to Know Us Better
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Ready to experience the Mobigas difference? Contact us today to learn more about 
            our services or to place your first order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-500 transition-colors inline-block"
            >
              Contact Us
            </a>
            <a
              href="/products"
              className="bg-transparent border-2 border-gray-400 text-gray-300 font-semibold py-3 px-8 rounded-lg hover:bg-gray-600 hover:text-white transition-colors inline-block"
            >
              View Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 