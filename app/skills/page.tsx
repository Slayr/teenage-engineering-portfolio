"use client";

import { motion } from 'motion/react';
import { 
  Network, 
  Terminal, 
  LayoutTemplate, 
  BrainCircuit, 
  CloudCog, 
  Globe 
} from 'lucide-react';

const cvCategories = [
  { id: 'cat-languages', label: 'Languages', icon: Terminal },
  { id: 'cat-frameworks', label: 'Frameworks & Web', icon: LayoutTemplate },
  { id: 'cat-ai', label: 'AI & ML', icon: BrainCircuit },
  { id: 'cat-tools', label: 'Tools & Cloud', icon: CloudCog },
  { id: 'cat-spoken', label: 'Spoken Languages', icon: Globe }
];

const cvSkills = [
  { label: 'Python', category: 'cat-languages' },
  { label: 'R', category: 'cat-languages' },
  { label: 'SQL', category: 'cat-languages' },
  { label: 'C++', category: 'cat-languages' },
  { label: 'Java', category: 'cat-languages' },
  { label: 'Javascript', category: 'cat-languages' },
  { label: 'PHP', category: 'cat-languages' },
  { label: 'Laravel', category: 'cat-frameworks' },
  { label: 'Backend Dev', category: 'cat-frameworks' },
  { label: 'Web3', category: 'cat-frameworks' },
  { label: 'PostgresQL', category: 'cat-frameworks' },
  { label: 'MongoDB', category: 'cat-frameworks' },
  { label: 'Apache', category: 'cat-frameworks' },
  { label: 'NGINX', category: 'cat-frameworks' },
  { label: 'Svelte', category: 'cat-frameworks' },
  { label: 'Cloudflare', category: 'cat-frameworks' },
  { label: 'CNNs', category: 'cat-ai' },
  { label: 'NLP', category: 'cat-ai' },
  { label: 'Feature Detection', category: 'cat-ai' },
  { label: 'Deep Learning', category: 'cat-ai' },
  { label: 'Computer Vision', category: 'cat-ai' },
  { label: 'RL', category: 'cat-ai' },
  { label: 'Transformer Arch', category: 'cat-ai' },
  { label: 'LLM Fine-Tuning', category: 'cat-ai' },
  { label: 'AWS (Cloud Foundations)', category: 'cat-tools' },
  { label: 'Git', category: 'cat-tools' },
  { label: 'Google Suite', category: 'cat-tools' },
  { label: 'Microsoft Azure', category: 'cat-tools' },
  { label: 'Power BI', category: 'cat-tools' },
  { label: 'Tableau', category: 'cat-tools' },
  { label: 'Excel', category: 'cat-tools' },
  { label: 'English', category: 'cat-spoken' },
  { label: 'Hindi', category: 'cat-spoken' },
  { label: 'Spanish', category: 'cat-spoken' },
  { label: 'French', category: 'cat-spoken' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function SkillsPage() {
  return (
    <div className="space-y-12 pb-20">
      <div className="te-border-b pb-6">
        <h1 className="text-4xl te-heading flex items-center gap-4">
          <Network size={36} className="text-accent" />
          Technical Repository
        </h1>
        <p className="te-label mt-4">KNOWLEDGE BASE & SKILL ASSESSMENTS</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cvCategories.map((category) => {
          const Icon = category.icon;
          const categorySkills = cvSkills.filter((s) => s.category === category.id);
          
          return (
            <motion.div 
              key={category.id}
              variants={itemVariants}
              className="te-card p-6 flex flex-col h-full group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-ink/5 group-hover:bg-accent/10 transition-colors">
                  <Icon className="w-6 h-6 text-ink group-hover:text-accent transition-colors" />
                </div>
                <h2 className="text-xl font-bold font-sans tracking-tight">{category.label}</h2>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {categorySkills.map((skill) => (
                  <span 
                    key={skill.label}
                    className="te-pill text-sm hover:scale-105 cursor-default"
                  >
                    {skill.label}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
