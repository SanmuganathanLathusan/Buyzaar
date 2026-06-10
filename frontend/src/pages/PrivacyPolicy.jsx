import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="page-wrapper">
      <div className="page-container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
              <Shield className="w-3.5 h-3.5" />
              Trust & Safety
            </div>
            <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-slate-500 font-medium">Last updated: June 2026</p>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card-lg p-8 md:p-12 space-y-8 text-slate-600 dark:text-slate-300">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-secondary dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">1. Information We Collect</h2>
              </div>
              <p className="leading-relaxed">
                We collect information you provide directly to us when you create an account, place an order, or contact us. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal identifiers (Name, Email, Phone number, Address)</li>
                <li>Account credentials (Passwords are hashed and never stored in plain text)</li>
                <li>Order history and transaction details</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-secondary dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
              </div>
              <p className="leading-relaxed">
                Your data is used to process orders, verify your identity, and provide a personalized shopping experience. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-secondary dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold">3. Security Measures</h2>
              </div>
              <p className="leading-relaxed">
                We implement industry-standard security measures, including SSL encryption for all data transmission and secure hashing for passwords. For this demo project, payment information is not stored and is used for simulation purposes only.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-secondary dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold">4. Contact Us</h2>
              </div>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at <span className="font-bold text-primary">buyzaar@gmail.com</span>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
