import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const TermsOfService = () => {
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
              <FileText className="w-3.5 h-3.5" />
              Legal Terms
            </div>
            <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight mb-4">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-slate-500 font-medium">Last updated: June 2026</p>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card-lg p-8 md:p-12 space-y-8 text-slate-600 dark:text-slate-300">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-secondary dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
              </div>
              <p className="leading-relaxed">
                By accessing or using Buyzaar, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our platform.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-secondary dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold">2. Use of License</h2>
              </div>
              <p className="leading-relaxed">
                This website is currently a demonstration project. Users are granted permission to browse and test features. Any transactions simulated on this platform are not binding and do not involve real currency.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-secondary dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold">3. User Conduct</h2>
              </div>
              <p className="leading-relaxed">
                Users must provide accurate information when registering or requesting vendor access. Any misuse of the platform or attempt to bypass security measures is strictly prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-secondary dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold">4. Disclaimer</h2>
              </div>
              <p className="leading-relaxed font-medium italic">
                Buyzaar is provided "as is". We make no warranties, expressed or implied, regarding the reliability or security of this demonstration platform for real-world commercial use without further security audits.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
