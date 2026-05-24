import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: 'Our Location',
    detail: '123 Smart Shop Ave, Commerce City, CA 90210',
    sub: 'Visit us anytime',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Phone,
    title: 'Phone Number',
    detail: '+94 778410323',
    sub: 'Mon – Fri, 9am – 6pm',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    icon: Mail,
    title: 'Email Address',
    detail: 'buyzaar@gmail.com',
    sub: 'We reply within 24 hours',
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    detail: 'Mon – Sat: 9:00am – 6:00pm',
    sub: 'Closed on public holidays',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
];

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-surface-muted dark:bg-slate-800 text-sm text-secondary dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-white dark:focus:bg-slate-700 transition-all duration-200 outline-none';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent,   setIsSent]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="page-wrapper">
      <div className="page-container py-12">

        {/* ── Hero header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
            <MessageSquare className="w-3.5 h-3.5" />
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-secondary dark:text-white tracking-tight mb-3">
            We'd love to hear <span className="gradient-text">from you</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Have a question, feedback, or need support? Fill out the form below and our team will respond promptly.
          </p>
        </motion.div>

        {/* ── Contact info cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {CONTACT_INFO.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-white dark:bg-surface-dark rounded-2xl border border-border dark:border-border-dark shadow-card hover:shadow-card-lg p-5 flex flex-col gap-3 transition-shadow"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary dark:text-white mb-0.5">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{item.detail}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Form + Map row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-3 bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card-lg p-7 md:p-9"
          >
            {isSent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-secondary dark:text-white">Message Sent!</h3>
                <p className="text-sm text-slate-500 max-w-xs">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="btn-secondary btn-md rounded-2xl mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-secondary dark:text-white mb-1">Send us a Message</h2>
                <p className="text-sm text-slate-500 mb-7">All fields marked with * are required.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text" name="name" required
                        value={formData.name} onChange={handleChange}
                        className={inputCls} placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        className={inputCls} placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text" name="subject"
                      value={formData.subject} onChange={handleChange}
                      className={inputCls} placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message" rows={5} required
                      value={formData.message} onChange={handleChange}
                      className={`${inputCls} resize-none`}
                      placeholder="Type your message here…"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary btn-lg w-full rounded-2xl justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>

          {/* Aside info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* FAQ teaser */}
            <div className="bg-gradient-to-br from-primary to-cyan-500 rounded-3xl p-6 text-white relative overflow-hidden flex-1">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Need quick help?</h3>
                <p className="text-white/75 text-sm mb-5">
                  Browse our help center for instant answers to the most common questions.
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary text-sm font-bold rounded-xl hover:bg-primary-light transition-colors shadow-md">
                  Visit Help Center
                </button>
              </div>
            </div>

            {/* Social / response time */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-border dark:border-border-dark shadow-card p-6">
              <h3 className="font-bold text-secondary dark:text-white text-sm mb-4">Response Times</h3>
              <ul className="space-y-3">
                {[
                  { channel: 'Email Support', time: 'Within 24 hours',  dot: 'bg-emerald-400' },
                  { channel: 'Live Chat',     time: 'Within 5 minutes', dot: 'bg-blue-400'    },
                  { channel: 'Phone',         time: 'Instant',          dot: 'bg-violet-400'  },
                ].map((r) => (
                  <li key={r.channel} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                      <span className="text-sm text-secondary dark:text-white font-medium">{r.channel}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{r.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
