'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Code2 } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  category: string;
  isCategory?: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Link {
  source: string;
  target: string;
}

const cvCategories = [
  { id: 'cat-languages', label: 'Languages' },
  { id: 'cat-frameworks', label: 'Frameworks & Web' },
  { id: 'cat-ai', label: 'AI & ML' },
  { id: 'cat-tools', label: 'Tools & Cloud' },
  { id: 'cat-spoken', label: 'Spoken Languages' }
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

export default function Skills() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize nodes with random positions
    const initialNodes: Node[] = [];
    const initialLinks: Link[] = [];
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;

    // Add category nodes in a cross pattern
    cvCategories.forEach((cat, i) => {
      const angle = (i / cvCategories.length) * Math.PI * 2;
      const r = Math.min(width, height) * 0.25;
      initialNodes.push({
        id: cat.id,
        label: cat.label,
        category: cat.id,
        isCategory: true,
        x: width / 2 + Math.cos(angle) * r,
        y: height / 2 + Math.sin(angle) * r,
        vx: 0,
        vy: 0
      });
    });

    // Add skill nodes loosely around their category
    cvSkills.forEach((skill) => {
      const catNode = initialNodes.find(n => n.id === skill.category);
      const id = `skill-${skill.label.replace(/\s+/g, '-').toLowerCase()}`;
      const angle = Math.random() * Math.PI * 2;
      const r = 100 + Math.random() * 50;
      initialNodes.push({
        id,
        label: skill.label,
        category: skill.category,
        isCategory: false,
        x: (catNode?.x || width / 2) + Math.cos(angle) * r,
        y: (catNode?.y || height / 2) + Math.sin(angle) * r,
        vx: 0,
        vy: 0
      });
      initialLinks.push({ source: skill.category, target: id });
    });

    setNodes(initialNodes);
    setLinks(initialLinks);

    // Simple Force Simulation
    let animationFrameId: number;
    let currentNodes = [...initialNodes];

    const simulate = () => {
      const attraction = 0.02;
      
      const newNodes = currentNodes.map(node => ({ ...node }));

      for (let i = 0; i < newNodes.length; i++) {
        for (let j = i + 1; j < newNodes.length; j++) {
          const n1 = newNodes[i];
          const n2 = newNodes[j];
          let dx = n2.x - n1.x;
          let dy = n2.y - n1.y;
          
          if (dx === 0 && dy === 0) {
            dx = (Math.random() - 0.5) * 10;
            dy = (Math.random() - 0.5) * 10;
          }
          
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);

          // Minimum distance constraint (prevents labels overlapping)
          const minDistance = n1.isCategory || n2.isCategory ? 160 : 110;
          
          if (dist < minDistance) {
            const force = (minDistance - dist) * 0.2;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx -= fx;
            n1.vy -= fy;
            n2.vx += fx;
            n2.vy += fy;
          }

          // Attraction for linked nodes
          const isLinked = initialLinks.some(l => 
            (l.source === n1.id && l.target === n2.id) || 
            (l.source === n2.id && l.target === n1.id)
          );

          if (isLinked) {
            const pull = (dist - (n1.isCategory || n2.isCategory ? 160 : 110)) * attraction;
            const px = (dx / dist) * pull;
            const py = (dy / dist) * pull;
            n1.vx += px;
            n1.vy += py;
            n2.vx -= px;
            n2.vy -= py;
          }
        }

        const n = newNodes[i];
        
        // Gentle center gravity
        const cx = width / 2 - n.x;
        const cy = height / 2 - n.y;
        n.vx += cx * (n.isCategory ? 0.005 : 0.001);
        n.vy += cy * (n.isCategory ? 0.005 : 0.001);

        n.vx *= 0.85; // Friction
        n.vy *= 0.85;
        
        n.x += n.vx;
        n.y += n.vy;

        // Keep bounds padding
        const padding = 100;
        n.x = Math.max(padding, Math.min(width - padding, n.x));
        n.y = Math.max(padding, Math.min(height - padding, n.y));
      }

      currentNodes = newNodes;
      setNodes(newNodes);
      animationFrameId = requestAnimationFrame(simulate);
    };

    animationFrameId = requestAnimationFrame(simulate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const getActiveConnections = () => {
    if (!hoveredNode) return [];
    return links.filter(l => l.source === hoveredNode || l.target === hoveredNode);
  };

  const isNodeActive = (id: string, category: string) => {
    if (!hoveredNode) return false;
    if (id === hoveredNode) return true;
    const activeLinks = getActiveConnections();
    return activeLinks.some(l => l.source === id || l.target === id);
  };

  if (!isClient) {
    return (
      <div className="space-y-12">
        <div className="te-border-b pb-6">
          <h1 className="text-4xl te-heading flex items-center gap-4">
            <Code2 size={36} />
            Skills Graph
          </h1>
          <p className="te-label mt-4">Initializing neural network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)]">
      <div className="te-border-b pb-6 shrink-0">
        <h1 className="text-4xl te-heading flex items-center gap-4">
          <Code2 size={36} className="text-accent" />
          Technical Graph
        </h1>
        <p className="te-label mt-4">Hover over nodes to explore domains and technologies.</p>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 w-full relative bg-ink/5 te-border rounded-xl overflow-hidden cursor-crosshair"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {links.map((link, i) => {
            const sourceInfo = nodes.find(n => n.id === link.source);
            const targetInfo = nodes.find(n => n.id === link.target);
            if (!sourceInfo || !targetInfo) return null;

            const isHighlighted = hoveredNode && 
              (hoveredNode === sourceInfo.id || hoveredNode === targetInfo.id || 
               hoveredNode === sourceInfo.category);

            return (
              <line
                key={i}
                x1={sourceInfo.x}
                y1={sourceInfo.y}
                x2={targetInfo.x}
                y2={targetInfo.y}
                stroke={isHighlighted ? 'var(--accent)' : 'currentColor'}
                strokeWidth={isHighlighted ? 2 : 1}
                className={isHighlighted ? 'opacity-100' : 'opacity-10'}
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s, opacity 0.3s' }}
              />
            );
          })}
        </svg>

        {nodes.map(node => {
          const active = isNodeActive(node.id, node.category);
          const dimmed = hoveredNode && !active;

          return (
            <div
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-10 
                ${dimmed ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}
                ${active ? 'z-20 scale-110 drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]' : ''}
              `}
              style={{
                left: node.x,
                top: node.y,
              }}
            >
              <div 
                className={`
                  whitespace-nowrap flex items-center justify-center font-bold tracking-tight rounded-full te-border
                  ${node.isCategory 
                    ? 'px-4 py-2 bg-accent text-bg border-accent shadow-lg text-sm md:text-base' 
                    : 'px-3 py-1.5 bg-bg text-ink/90 text-xs md:text-sm hover:border-accent hover:text-accent'}
                  ${active && !node.isCategory ? 'border-accent text-accent bg-bg/90 backdrop-blur-md' : ''}
                `}
              >
                {node.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
