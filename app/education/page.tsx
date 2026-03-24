'use client';

import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

const education = [
  {
    degree: "M.Sc. Data Science",
    school: "University of Technology",
    status: "In Progress",
    duration: "2025 - 2027",
    details: "Specializing in deep learning and advanced statistical modeling.",
  },
  {
    degree: "B.Tech Artificial Intelligence",
    school: "Institute of Engineering",
    status: "Completed",
    duration: "2021 - 2025",
    details: "Graduated with honors. Thesis on autonomous drone navigation using computer vision.",
  },
  {
    degree: "IB Diploma",
    school: "International School",
    status: "Completed",
    duration: "2019 - 2021",
    details: "Higher Level Mathematics, Physics, and Computer Science.",
  }
];

export default function Education() {
  return (
    <div className="space-y-12">
      <div className="te-border-b pb-6">
        <h1 className="text-4xl te-heading flex items-center gap-4">
          <GraduationCap size={36} />
          Education
        </h1>
        <p className="te-label mt-4">Academic background and degrees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
        {education.map((edu, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="te-card p-8 flex flex-col h-full relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GraduationCap size={64} />
            </div>
            
            <div className="z-10 flex-1">
              <span className={`te-pill mb-4 ${edu.status === 'In Progress' ? 'bg-accent-orange text-ink border-accent-orange' : 'bg-ink text-bg'}`}>
                {edu.status}
              </span>
              <h3 className="text-2xl font-bold mb-2">{edu.degree}</h3>
              <p className="text-accent-orange font-mono text-sm uppercase tracking-wider mb-6">{edu.school}</p>
              <p className="text-ink/80 leading-relaxed">
                {edu.details}
              </p>
            </div>
            
            <div className="z-10 mt-8 pt-4 te-border-t flex items-center justify-between">
              <span className="te-label">{edu.duration}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
