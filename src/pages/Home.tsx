import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Users, Target, TrendingUp, ArrowRight } from 'lucide-react'
import { Header } from '../components/Layout/Header'
import vlogo from "../images/vlogo.png";
import heroimg2 from "../images/heroimg2.jpg";

export function Home() {
  const features = [
    {
      icon: Trophy,
      title: 'Compete in Public and Private Leagues',
      description: 'Create League With Friends',
      action: 'Start a League ▶'
    },
    {
      icon: Target,
      title: 'Go Big With Your Banker Pick',
      description: 'Guess Match Outcomes',
      action: 'Try a Prediction ▶'
    },
    {
      icon: TrendingUp,
      title: 'Boost Your Game With Personal Analytics',
      description: 'Gain Rank in Real Time',
      action: 'View Top Players ▶'
    }
  ]

  return (
    <div className="min-h-screen bg-secondary-950">
      <Header showSignIn={true} />

      {/* Hero Section */}
      <section className="relative bg-primary-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mb-8">
                  {/* <img
                    src=""
                    alt=""
                    className="w-16 h-16 rounded-full object-cover"
                  /> */}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  How Well Do You Know The Beautiful Game?
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Go head-to-head with friends and players worldwide in weekly football challenges.
                </p>
                <Link
                  to="/signin"
                  className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-primary-500/20 backdrop-blur-md border border-primary-400/30 rounded-2xl p-8">
                <img
                  src={heroimg2}
                  alt="Football players in action"
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-primary-600/10 backdrop-blur-md border border-primary-500/20 rounded-xl p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary-600/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-secondary-300 mb-4">{feature.description}</p>
                  <button className="text-primary-400 hover:text-primary-300 font-medium">
                    {feature.action}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <img 
                    src={vlogo} 
                    alt="VI-Predict Logo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-white">VI-Predict</span>
              </div>
              <p className="text-secondary-400 mb-6">
                "To make every match, race, or game more thrilling by turning predictions into competitions. 
                We believe anyone can be a prophet... if they've got the guts to back their guesses!"
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Terms And Conditions</Link></li>
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">About us</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">How it works</Link></li>
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Why choose us ?</Link></li>
                <li><Link to="/about" className="text-secondary-400 hover:text-white transition-colors">About us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Events</Link></li>
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Invite a Friend</Link></li>
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Podcast</Link></li>
                <li><Link to="#" className="text-secondary-400 hover:text-white transition-colors">Articles</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              Copyright © 2025, VI-Predict All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center text-secondary-400 hover:text-white hover:bg-secondary-700 transition-colors">
                f
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center text-secondary-400 hover:text-white hover:bg-secondary-700 transition-colors">
                𝕏
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center text-secondary-400 hover:text-white hover:bg-secondary-700 transition-colors">
                📷
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}