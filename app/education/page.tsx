'use client';

import { motion } from 'motion/react';
import { GraduationCap, Award, Users } from 'lucide-react';

const education = [
  {
    degree: "M.Sc in Data Science",
    school: "Manipal Academy of Higher Education – PSPH",
    status: "In Progress",
    duration: "July 2025 - Present",
    details: "Manipal, Karnataka.",
  },
  {
    degree: "B.Tech in Computer Science Engineering",
    school: "The NorthCap University",
    status: "Completed",
    duration: "2021 - May 2025",
    details: "Specialization in AI & ML. Gurugram, Haryana.",
  },
  {
    degree: "IB Diploma Programme",
    school: "Pathways World School",
    status: "Completed",
    duration: "2011 - 2021",
    details: "Gurugram, Haryana.",
  }
];

const certifications = [
  "Harvard University: CS50X (Intro to Computer Science) & CS50AI (Intro to AI with Python)",
  "AWS: Academy Cloud Foundations & Machine Learning Foundations",
  "World Quant University: Applied Data Science Lab",
  "Arizona State University: Certificate of Innovation",
];

const leadership = [
  {
    title: "President, Media Relations Club",
    duration: "2021 - 2023",
    details: "Orchestrated social media campaigns and university marketing collaborations."
  },
  {
    title: "Secretary, OPTICA",
    duration: "2021 - 2023",
    details: "Managed administrative tasks and fostered a collaborative research environment."
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 te-border-t">
        <div className="space-y-8">
          <h2 className="text-3xl te-heading flex items-center gap-3">
            <Award size={28} className="text-accent" />
            Certifications
          </h2>
          <div className="space-y-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="te-card p-6 border-l-4 border-l-accent"
              >
                <p className="font-mono text-sm">{cert}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-3xl te-heading flex items-center gap-3">
            <Users size={28} className="text-accent" />
            Leadership
          </h2>
          <div className="space-y-6">
            {leadership.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="te-card p-6"
              >
                <div className="flex justify-between items-start gap-4 mb-2 cursor-default">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <span className="te-pill bg-ink text-bg shrink-0">{item.duration}</span>
                </div>
                <p className="text-ink/80 text-sm leading-relaxed">{item.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
