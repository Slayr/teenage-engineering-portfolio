'use client';

import { motion } from 'motion/react';
import { Briefcase, Download } from 'lucide-react';

const experiences = [
  {
    role: "Research Collaborator",
    company: "Google User Research (Remote)",
    duration: "Jan 2025 - Present",
    summary: "Collaborated with Google's user research team to evaluate early-stage app prototypes, providing data-driven feedback.",
  },
  {
    role: "SDE Intern",
    company: "Stratbeans (Gurugram)",
    duration: "July 2024 - Dec 2024",
    summary: "Developed and maintained LMS systems using PHP and Laravel. Implemented critical bug fixes and worked on prototyping updated versions of tech stack using Laravel Integrations with AngularJS and Tailwind CSS.",
  },
  {
    role: "Senior Intern",
    company: "HopDrones (Gurugram)",
    duration: "July 2023 - Nov 2023",
    summary: "Managed a team of interns. Achieved and exceeded a goal of development of autonomous Motion detection and tracking in lightweight drones using YOLO and ByteTrack.",
  },
  {
    role: "Campus Ambassador",
    company: "Gemini Solutions International (Remote)",
    duration: "2022 - May 2025",
    summary: "Championed the company’s presence on campus through targeted outreach and events.",
  }
];

export default function Experience() {
  return (
    <div className="space-y-12">
      <div className="te-border-b pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl te-heading flex items-center gap-4">
            <Briefcase size={36} />
            Experience
          </h1>
          <p className="te-label mt-4">Professional timeline and roles.</p>
        </div>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="te-button te-button-accent flex items-center gap-2 w-fit">
          <Download size={16} />
          Download Resume
        </a>
      </div>

      <div className="relative border-l-2 border-dashed border-line ml-4 md:ml-8 space-y-12 py-8">
        {experiences.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative pl-8 md:pl-12"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-ink border-4 border-bg" />
            
            <div className="te-card p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold">{exp.role}</h3>
                  <p className="text-accent-orange font-mono text-sm uppercase tracking-wider">{exp.company}</p>
                </div>
                <span className="te-pill bg-ink text-bg">{exp.duration}</span>
              </div>
              <p className="text-ink/80 leading-relaxed">
                {exp.summary}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
