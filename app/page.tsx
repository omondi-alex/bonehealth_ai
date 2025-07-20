'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiArrowRight, FiShield, FiCpu, FiTrendingUp, FiUsers, FiAward, FiZap, FiX } from 'react-icons/fi';
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

const featureImportance = [
  { name: "Age", importance: 0.32 },
  { name: "Gender", importance: 0.18 },
  { name: "Hormonal Changes", importance: 0.15 },
  { name: "Body Weight", importance: 0.10 },
  { name: "Calcium Intake", importance: 0.08 },
  { name: "Physical Activity", importance: 0.07 },
  { name: "Smoking", importance: 0.05 },
  { name: "Alcohol Consumption", importance: 0.03 },
  { name: "Prior Fractures", importance: 0.02 },
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
  const [showRedirectLoader, setShowRedirectLoader] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [showFeaturesPopup, setShowFeaturesPopup] = useState(false);

  useEffect(() => {
    // Always log out when visiting the home page
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    // Dispatch custom event to notify other components (like Navbar)
    window.dispatchEvent(new Event('localStorageChange'));
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      // Show redirect loader immediately
      setShowRedirectLoader(true);
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

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowUploadPopup(true);
  };

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowFeaturesPopup(true);
  };

  // Show full-screen redirect loader
  if (showRedirectLoader) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Welcome to BoneHealth AI</h2>
          <p className="text-blue-100">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
                <button 
                  onClick={handleFeaturesClick}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                >
                  Learn More
                </button>
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
              <button 
                onClick={handleUploadClick}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                Upload Data
              </button>
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
              
              <button 
                onClick={handleUploadClick}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 text-center group cursor-pointer w-full"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-200">
                  📊
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Analysis</h3>
                <p className="text-gray-600 mb-6">Upload and analyze osteoporosis datasets for comprehensive insights.</p>
                <div className="text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                  Upload Data →
                </div>
              </button>
              
              <button 
                onClick={handleFeaturesClick}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-8 text-center group cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-200">
                  💡
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Feature Analysis</h3>
                <p className="text-gray-600 mb-6">Explore which factors most significantly impact osteoporosis risk.</p>
                <div className="text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-200">
                  Explore Features →
                </div>
              </button>
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

      {/* Upload Data Popup */}
      {showUploadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 lg:p-8 relative mx-4">
            {/* Close Button */}
            <button
              onClick={() => setShowUploadPopup(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Header with Icon */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl sm:text-3xl">📊</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Data Upload Portal</h3>
              <p className="text-sm sm:text-base text-gray-600">Ready to analyze your data?</p>
            </div>

            {/* Content */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">🚀 What You Can Do:</h4>
                <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                  <li>• Upload patient datasets for analysis</li>
                  <li>• Get comprehensive osteoporosis insights</li>
                  <li>• Access advanced AI-powered predictions</li>
                  <li>• Generate detailed risk assessments</li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-amber-900 mb-2 text-sm sm:text-base">⚠️ Important Notice:</h4>
                <p className="text-xs sm:text-sm text-amber-800">
                  Data upload functionality is currently being configured for your organization. 
                  Please contact your system administrator to enable this feature.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => {
                  window.location.href =
                    'mailto:omondialex3517@gmail.com?subject=Data%20Upload%20Request&body=Hello%20Admin%2C%0A%0AI%20would%20like%20to%20request%20access%20to%20the%20data%20upload%20feature%20on%20BoneHealth%20AI.%20Please%20let%20me%20know%20how%20I%20can%20proceed.%0A%0AThank%20you!';
                  setShowUploadPopup(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Contact Admin
              </button>
              <button
                onClick={() => setShowUploadPopup(false)}
                className="w-full border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                Maybe Later
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs text-gray-500">
                Need help? Email: <span className="text-blue-600">omondialex3517@gmail.com</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features Popup */}
      {showFeaturesPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl max-w-sm sm:max-w-lg w-full p-4 sm:p-6 lg:p-8 relative mx-4 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowFeaturesPopup(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Header with Icon */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl sm:text-3xl">💡</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Feature Impact Analysis</h3>
              <p className="text-sm sm:text-base text-gray-600">Discover which factors most influence osteoporosis risk</p>
            </div>

            {/* Content */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">📊 Risk Factor Analysis</h4>
                <p className="text-xs sm:text-sm text-orange-800 mb-3">
                  Our AI model analyzes multiple factors to determine their relative importance in predicting osteoporosis risk. 
                  The chart below shows the impact of each feature.
                </p>
              </div>

              {/* Feature Importance Chart */}
              <div className="space-y-3 sm:space-y-4">
                {featureImportance.map((feature, idx) => (
                  <div key={feature.name} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">
                        {idx + 1}. {feature.name}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-blue-900">
                        {(feature.importance * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gradient-to-r from-yellow-200 to-blue-200 rounded-full h-3 sm:h-4 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-blue-500 h-3 sm:h-4 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${feature.importance * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Insights */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">🔍 Key Insights:</h4>
                <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                  <li>• <strong>Age</strong> is the most significant risk factor (32%)</li>
                  <li>• <strong>Gender</strong> plays a crucial role (18%)</li>
                  <li>• <strong>Hormonal changes</strong> are highly influential (15%)</li>
                  <li>• Lifestyle factors like <strong>body weight</strong> and <strong>physical activity</strong> matter</li>
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => setShowFeaturesPopup(false)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Got It!
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs text-gray-500">
                Data based on AI model analysis • Results may vary by individual
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
