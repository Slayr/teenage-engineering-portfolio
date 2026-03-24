'use client';

import { motion } from 'motion/react';
import { Code2 } from 'lucide-react';

const skills = [
  "Python", "JavaScript", "TypeScript", "C++", "Java",
  "React", "Next.js", "ExpressJS", "Node.js", "Tailwind CSS",
  "Machine Learning", "Deep Learning", "Biostatistics", "Data Science",
  "SQL", "NoSQL", "Firebase", "MongoDB", "PostgreSQL",
  "Git", "Docker", "AWS", "Google Cloud", "Linux",
  "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy"
];

export default function Skills() {
  return (
    <div className="space-y-12">
      <div className="te-border-b pb-6">
        <h1 className="text-4xl te-heading flex items-center gap-4">
          <Code2 size={36} />
          Skills & Domains
        </h1>
        <p className="te-label mt-4">Technical proficiencies and areas of expertise.</p>
      </div>

      <div className="flex flex-wrap gap-4 py-8">
        {skills.map((skill, i) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            whileHover={{ y: -5, scale: 1.05 }}
            className="te-pill text-sm md:text-base px-6 py-3 bg-bg hover:bg-ink hover:text-bg cursor-default"
          >
            {skill}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
