import React from 'react'
import { useState } from 'react'
import { Layout } from '../components/Layout/Layout'
import { Search, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react'

export function Help() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How do I make predictions?',
      answer: 'Navigate to the Fixtures page, select the current gameweek, and enter your predicted scores for each match. Don\'t forget to select your banker pick for double points!'
    },
    {
      question: 'What is a banker pick?',
      answer: 'A banker pick is your most confident prediction for the gameweek. If you get it right, you earn double points for that match. You can only select one banker per gameweek.'
    },
    {
      question: 'How is scoring calculated?',
      answer: 'You earn 10 points for a correct result (win/draw/loss), 15 points for correct score, and 30 points for a correct banker score. Partial points may be awarded for close predictions.'
    },
    {
      question: 'How do I create or join a league?',
      answer: 'Go to the Leagues page and click either "Create League" or "Join League". For private leagues, you\'ll need an invite code from the league creator.'
    },
    {
      question: 'When are prediction deadlines?',
      answer: 'Predictions must be submitted before the first match of each gameweek kicks off. The exact deadline is shown on the Fixtures page.'
    },
    {
      question: 'Can I change my predictions after submitting?',
      answer: 'Yes, you can modify your predictions until the gameweek deadline. After that, all predictions are locked.'
    },
    {
      question: 'How do leagues work?',
      answer: 'Leagues allow you to compete with friends or other users. Your points from each gameweek contribute to your league ranking. There are global, country, club, private, and public leagues.'
    },
    {
      question: 'What happens if a match is postponed?',
      answer: 'If a match is postponed, predictions for that match will be void and no points will be awarded. The match will be rescheduled for a future gameweek.'
    },
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Help Center</h1>
          <p className="text-secondary-400">Find answers to common questions</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-12"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-secondary-800/50 rounded-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary-700/30 transition-colors"
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-secondary-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-secondary-400" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-secondary-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-secondary-400">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        {/* <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Still need help?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-secondary-800/50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-semibold text-white">Email Support</h3>
                </div>
                <p className="text-secondary-300 mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <a
                  href="mailto:support@vi-predict.com"
                  className="btn-primary inline-block"
                >
                  Contact Support
                </a>
              </div>
              
              <div className="bg-secondary-800/50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-semibold text-white">Live Chat</h3>
                </div>
                <p className="text-secondary-300 mb-4">
                  Chat with our support team in real-time during business hours.
                </p>
                <button className="btn-primary">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Quick Links */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/terms"
                className="bg-secondary-800/50 rounded-lg p-4 hover:bg-secondary-700/50 transition-colors"
              >
                <h3 className="text-white font-medium mb-2">Terms & Conditions</h3>
                <p className="text-secondary-400 text-sm">Read our terms of service</p>
              </a>
              
              <a
                href="/privacy"
                className="bg-secondary-800/50 rounded-lg p-4 hover:bg-secondary-700/50 transition-colors"
              >
                <h3 className="text-white font-medium mb-2">Privacy Policy</h3>
                <p className="text-secondary-400 text-sm">Learn about data privacy</p>
              </a>
              
              <a
                href="/about"
                className="bg-secondary-800/50 rounded-lg p-4 hover:bg-secondary-700/50 transition-colors"
              >
                <h3 className="text-white font-medium mb-2">About VI-Predict</h3>
                <p className="text-secondary-400 text-sm">Learn more about our platform</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}