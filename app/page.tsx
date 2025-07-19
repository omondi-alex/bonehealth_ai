'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiArrowRight, FiShield, FiCpu, FiTrendingUp, FiUsers, FiAward, FiZap } from 'react-icons/fi';
import LoginModal from './components/LoginModal';

const features = [
  {
    icon: <FiCpu className="w-8 h-8" />,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze multiple risk factors simultaneously for accurate predictions.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: <FiShield className="w-8 h-8" />,
    title: 'Early Detection',
    description: 'Identify osteoporosis risk before symptoms appear, enabling proactive prevention strategies.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: <FiTrendingUp className="w-8 h-8" />,
    title: 'Data-Driven Insights',
    description: 'Comprehensive analysis of patient data to provide personalized risk assessments and recommendations.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: <FiUsers className="w-8 h-8" />,
    title: 'Healthcare Provider Support',
    description: 'Empower medical professionals with AI tools to make informed decisions about patient care.',
    color: 'from-orange-500 to-orange-600'
  }
];

const stats = [
  { number: '200M+', label: 'People Worldwide Affected' },
  { number: '1 in 3', label: 'Women Over 50' },
  { number: '1 in 5', label: 'Men Over 50' },
  { number: '90%', label: 'Preventable with Early Detection' }
];

const osteoporosisFacts = [
  'Osteoporosis is a silent disease that weakens bones, making them fragile and more likely to break.',
  'It affects over 200 million people worldwide, with women being particularly vulnerable after menopause.',
  'The condition often goes undetected until a fracture occurs, earning it the nickname "silent thief."',
  'Risk factors include age, gender, family history, low calcium intake, and certain medical conditions.',
  'Early detection and intervention can significantly reduce the risk of fractures and complications.'
];

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Always log out when visiting the home page
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      // Redirect to existing dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    }
  };

  const handleProtectedAction = () => {
    if (isLoggedIn) {
      window.location.href = '/dashboard';
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                  <FiZap className="w-4 h-4 inline mr-2" />
                  AI-Powered Osteoporosis Detection
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Revolutionizing
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Bone Health</span>
                <br />
                with AI
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                BoneHealth AI leverages cutting-edge artificial intelligence to predict osteoporosis risk, 
                enabling early detection and prevention of this silent but devastating disease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={handleProtectedAction}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
                >
                  Start Risk Assessment
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </button>
                <Link href="/features">
                  <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What is Osteoporosis Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Understanding <span className="text-red-600">Osteoporosis</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Osteoporosis is a progressive bone disease that affects millions worldwide. 
                Understanding it is the first step toward prevention.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">The Silent Disease</h3>
                  <ul className="space-y-4">
                    {osteoporosisFacts.map((fact, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Why Early Detection Matters</h4>
                  <p className="text-blue-800">
                    Early detection can prevent fractures, reduce pain, and improve quality of life. 
                    Our AI system helps identify risk factors before they become serious problems.
                  </p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-green-900 mb-2">Prevention is Key</h4>
                  <p className="text-green-800">
                    With proper lifestyle changes, medication, and monitoring, osteoporosis can be 
                    managed effectively, preventing debilitating fractures.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-purple-900 mb-2">Personalized Care</h4>
                  <p className="text-purple-800">
                    Every individual is different. Our AI analyzes your unique risk factors to provide 
                    personalized recommendations and care plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                The Global Impact
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Osteoporosis affects millions of lives worldwide. These numbers tell the story of why early detection is crucial.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How BoneHealth AI Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How <span className="text-blue-600">BoneHealth AI</span> Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our advanced AI system combines multiple data points to provide accurate risk assessments 
                and personalized recommendations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Take Control of Your Bone Health?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of healthcare providers and patients who are already using BoneHealth AI 
              to predict and prevent osteoporosis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleProtectedAction}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <FiAward className="w-5 h-5 mr-2" />
                Start Your Assessment
              </button>
              <Link href="/upload">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200">
                  Upload Data
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Get Started Today
              </h2>
              <p className="text-xl text-gray-600">
                Choose the tool that best fits your needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <button 
                onClick={handleProtectedAction}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 text-center group cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-200">
                  🩺
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Risk Prediction</h3>
                <p className="text-gray-600 mb-6">Enter patient data to predict osteoporosis risk using our advanced AI model.</p>
                <div className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                  Start Prediction →
                </div>
              </button>
              
              <Link href="/upload">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 text-center group cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-200">
                    📊
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Analysis</h3>
                  <p className="text-gray-600 mb-6">Upload and analyze osteoporosis datasets for comprehensive insights.</p>
                  <div className="text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                    Upload Data →
                  </div>
                </div>
              </Link>
              
              <Link href="/features">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 text-center group cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-200">
                    💡
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Feature Analysis</h3>
                  <p className="text-gray-600 mb-6">Explore which factors most significantly impact osteoporosis risk.</p>
                  <div className="text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                    Explore Features →
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </>
  );
}
