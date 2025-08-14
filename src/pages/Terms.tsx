import React from 'react'
import { Layout } from '../components/Layout/Layout'

export function Terms() {
  return (
    <Layout showSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Terms and Conditions</h1>
          <p className="text-secondary-400">Last updated: January 2025</p>
        </div>

        <div className="glass-card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-secondary-300 leading-relaxed">
              By accessing and using VI-Predict ("the Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              VI-Predict is a football prediction platform that allows users to:
            </p>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4">
              <li>Make predictions on football match outcomes</li>
              <li>Participate in various leagues and competitions</li>
              <li>Track their prediction performance and statistics</li>
              <li>Compete with other users in leaderboards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. User Conduct</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Submit false or misleading information</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use automated systems to access the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Predictions and Scoring</h2>
            <p className="text-secondary-300 leading-relaxed mb-4">
              The prediction system operates as follows:
            </p>
            <ul className="list-disc list-inside text-secondary-300 space-y-2 ml-4">
              <li>Predictions must be submitted before the specified deadline</li>
              <li>Points are awarded based on the accuracy of predictions</li>
              <li>Scoring rules may be updated from time to time</li>
              <li>All decisions regarding scoring are final</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Privacy</h2>
            <p className="text-secondary-300 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
              of the Service, to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
            <p className="text-secondary-300 leading-relaxed">
              The Service and its original content, features, and functionality are owned by VI-Predict and are 
              protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
            <p className="text-secondary-300 leading-relaxed">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice 
              or liability, under our sole discretion, for any reason whatsoever, including without limitation if you 
              breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimer</h2>
            <p className="text-secondary-300 leading-relaxed">
              The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, 
              this Company excludes all representations, warranties, conditions and terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
            <p className="text-secondary-300 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes 
              via email or through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
            <p className="text-secondary-300 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-secondary-800/50 rounded-lg">
              <p className="text-white">Email: legal@vi-predict.com</p>
              <p className="text-white">Address: VI-Predict Legal Department</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}