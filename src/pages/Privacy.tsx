import React from 'react'
import { Layout } from '../components/Layout/Layout'

export function Privacy() {
  return (
    <Layout showSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-secondary-400">Last updated: January 2025</p>
        </div>

        <div className="glass-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              make predictions, or contact us for support.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4 mb-4">
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">Usage Information</h3>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4">
              <li>Predictions and league participation</li>
              <li>Performance statistics</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4">
              <li>Provide and maintain our services</li>
              <li>Process your predictions and calculate scores</li>
              <li>Send you updates about gameweeks and results</li>
              <li>Improve our platform and user experience</li>
              <li>Respond to your comments and questions</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">Public Information</h3>
            <p className="text-secondary-300 leading-relaxed mb-4">
              Your username, predictions, and league standings may be visible to other users as part of the competitive nature of the platform.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Service Providers</h3>
            <p className="text-secondary-300 leading-relaxed mb-4">
              We may share information with trusted service providers who assist us in operating our platform, conducting business, or serving users.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Legal Requirements</h3>
            <p className="text-secondary-300 leading-relaxed">
              We may disclose information when required by law or to protect our rights, property, or safety.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure hosting infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights and Choices</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4">
              <li>Access and update your account information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Correct inaccurate information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content</li>
              <li>Ensure platform security</li>
            </ul>
            <p className="text-secondary-300 leading-relaxed mt-4">
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
            <p className="text-secondary-300 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill 
              the purposes outlined in this policy. When you delete your account, we will delete or anonymize 
              your personal information within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
            <p className="text-secondary-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information during such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
            <p className="text-secondary-300 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you become aware that a child has provided 
              us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
            <p className="text-secondary-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="p-4 bg-secondary-800/50 rounded-lg">
              <p className="text-white">Email: privacy@vi-predict.com</p>
              <p className="text-white">Address: VI-Predict Privacy Team</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}