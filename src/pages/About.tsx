import React from 'react'
import { Layout } from '../components/Layout/Layout'
import { Target, Users, Trophy, Zap } from 'lucide-react'
import vlogo from "../images/vlogo.png";

export function About() {
  const features = [
    {
      icon: Target,
      title: 'Accurate Predictions',
      description: 'Make precise match predictions and compete with friends in various leagues.'
    },
    {
      icon: Users,
      title: 'Social Competition',
      description: 'Create private leagues with friends or join public competitions with thousands of players.'
    },
    {
      icon: Trophy,
      title: 'Multiple Leagues',
      description: 'Participate in global, country, club, private, and public leagues simultaneously.'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant updates on match results, league standings, and your performance.'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Predictions Made', value: '2M+' },
    { label: 'Leagues Created', value: '10K+' },
    { label: 'Countries', value: '100+' }
  ]

  return (
    <Layout showSidebar={false}>
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                <img 
                  src={vlogo} 
                  alt="VI-Predict Logo" 
                  className="w-10 h-10 object-contain"
                />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About VI-Predict
          </h1>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto leading-relaxed">
            The ultimate football prediction platform where passion meets precision. 
            Join thousands of football fans in the most engaging prediction experience ever created.
          </p>
        </div>

        {/* Mission Section */}
        <div className="glass-card p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-secondary-300 leading-relaxed mb-8">
              At VI-Predict, we believe football is more than just a game—it's a passion that brings people together. 
              Our mission is to create the most engaging and competitive prediction platform where football fans can 
              showcase their knowledge, compete with friends, and experience the thrill of accurate predictions.
            </p>
            <div className="bg-primary-600/10 backdrop-blur-md border border-primary-500/20 rounded-xl p-8">
              <img
                src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Football stadium"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose VI-Predict?</h2>
            <p className="text-secondary-300 max-w-2xl mx-auto">
              We've built the most comprehensive football prediction platform with features designed 
              to enhance your prediction experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="glass-card p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-secondary-300">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass-card p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Growing Community</h2>
            <p className="text-secondary-300">
              Thousands of football fans trust VI-Predict for their prediction needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-secondary-300 max-w-2xl mx-auto">
              Getting started with VI-Predict is simple. Follow these steps to begin your prediction journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Sign Up</h3>
              <p className="text-secondary-300">
                Create your account and set up your profile to get started with predictions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Make Predictions</h3>
              <p className="text-secondary-300">
                Predict match scores for each gameweek and select your banker pick for double points.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Compete & Win</h3>
              <p className="text-secondary-300">
                Join leagues, compete with friends, and climb the leaderboards to prove your expertise.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-card p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Predicting?</h2>
          <p className="text-secondary-300 mb-8 max-w-2xl mx-auto">
            Join thousands of football fans who are already making predictions and competing in leagues. 
            Your throne awaits!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="btn-primary">
              Get Started Now
            </a>
            <a href="/signin" className="btn-secondary">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}