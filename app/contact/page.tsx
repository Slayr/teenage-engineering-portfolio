'use client';

import { motion } from 'motion/react';
import { Mail, Phone, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="space-y-12 max-w-2xl mx-auto">
      <div className="te-border-b pb-6 text-center">
        <h1 className="text-4xl te-heading flex items-center justify-center gap-4">
          <Send size={36} />
          Contact
        </h1>
        <p className="te-label mt-4">Let&apos;s build something together.</p>
      </div>

      <div className="py-12 space-y-8">
        <p className="text-xl text-center font-mono leading-relaxed mb-12">
          I&apos;m currently open for new opportunities and collaborations. 
          Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
        </p>

        <motion.a
          href="mailto:slayr@gmail.com"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="group flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-6 te-card hover:bg-accent-orange hover:text-ink transition-colors text-center sm:text-left"
        >
          <div className="p-4 rounded-full bg-ink text-bg group-hover:bg-bg group-hover:text-ink transition-colors shrink-0">
            <Mail size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-mono uppercase tracking-widest opacity-60 mb-1">Email</h3>
            <p className="text-xl md:text-2xl font-bold break-all">slayr@gmail.com</p>
          </div>
        </motion.a>

        <motion.a
          href="tel:+1234567890"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="group flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-6 te-card hover:bg-accent-orange hover:text-ink transition-colors text-center sm:text-left"
        >
          <div className="p-4 rounded-full bg-ink text-bg group-hover:bg-bg group-hover:text-ink transition-colors shrink-0">
            <Phone size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-mono uppercase tracking-widest opacity-60 mb-1">Phone</h3>
            <p className="text-xl md:text-2xl font-bold break-all">+1 (234) 567-890</p>
          </div>
        </motion.a>
      </div>
    </div>
  );
}
