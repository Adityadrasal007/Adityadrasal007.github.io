import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanEye,
  Cpu,
  Layers,
  ShieldCheck,
  ExternalLink,
  Mail,
  Sparkles,
  ArrowRight,
  Database,
  Activity,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { SectionHeading } from '../ui/SectionHeading';
import { GhostNumber } from '../ui/GhostNumber';
import { BracketCorners } from '../ui/BracketCorners';
import GlassFolder from '../ui/GlassFolder';
import visionFlowBanner from '../../assets/project-vision-flow.png';
import visionStudioBanner from '../../assets/project-vision-studio.png';
import { cn } from '../../lib/utils';

const PROJECTS_DATA = {
  'vision-flow': {
    id: 'vision-flow',
    title: 'VISION FLOW',
    subtitle: 'Production Edge-AI Live Detection & Monitoring System',
    tagline: 'Real-time multi-camera facility surveillance with edge-optimized YOLO inference and tamper-evident compliance.',
    badge: 'Proprietary IP · Edge AI',
    accentColor: '#ff5722',
    image: visionFlowBanner,
    artPreset: 'ember',
    metrics: [
      { label: 'Inference Latency', value: '~45 ms', note: 'Local edge hardware budget' },
      { label: 'Accuracy Uplift', value: '~20%', note: 'Active-learning triage loop' },
      { label: 'Stream Feeds', value: 'Multi-Cam', note: 'Concurrent RTSP, USB & QR' },
      { label: 'Audit Trail', value: 'SHA-256', note: 'Cryptographic compliance logs' },
    ],
    highlights: [
      {
        icon: Cpu,
        title: 'Async Multi-Camera Ingestion',
        description:
          'Concurrent RTSP, USB 3.0 & mobile QR camera decoders with asynchronous worker pools that decouple capture from neural inference, eliminating frame drops.',
      },
      {
        icon: Activity,
        title: 'Active-Learning Feedback Loop',
        description:
          'Automated edge triage routes boundary-confidence false detections (0.35–0.65) back to an offline verification staging pool, improving model accuracy by ~20% over time.',
      },
      {
        icon: ShieldCheck,
        title: 'Tamper-Evident Compliance Reports',
        description:
          'Embedded SQLite WAL engine auto-generates court-ready compliance PDF reports containing cryptographic timestamps and SHA-256 frame hashes.',
      },
    ],
    stack: ['Python', 'FastAPI', 'PyTorch', 'YOLOv8/11/26', 'OpenCV', 'SQLite (WAL)', 'SSE', 'ReportLab'],
    files: [
      { name: 'Architecture & Stream Ingestion', meta: 'RTSP · USB 3.0 · QR Mobile', art: 'ember' },
      { name: 'Real-Time Edge Telemetry', meta: '~45ms Avg Latency · CUDA', art: 'glacier' },
      { name: 'Active-Learning Feedback Loop', meta: '~20% Accuracy Uplift · MLOps', art: 'dusk' },
      { name: 'Tamper-Evident Audit Engine', meta: 'SQLite WAL · Cryptographic SHA', art: 'aurora' },
    ],
    linkedinSubject: 'Inquiry: Vision Flow Edge Architecture Demo',
    emailSubject: 'Inquiry: Vision Flow Architecture Demo - Aditya Rasal',
  },
  'vision-studio': {
    id: 'vision-studio',
    title: 'VISION STUDIO',
    subtitle: 'Fully Offline Computer Vision Model Studio',
    tagline: 'Offline desktop platform for end-to-end dataset preparation, SAM annotation, and GPU training with zero cloud dependency.',
    badge: 'Proprietary IP · Desktop CV',
    accentColor: '#8b5cf6',
    image: visionStudioBanner,
    artPreset: 'dusk',
    metrics: [
      { label: 'Cloud Dependency', value: '0%', note: '100% offline local GPU execution' },
      { label: 'Labeling Speedup', value: '~75%', note: 'Meta SAM single-click masks' },
      { label: 'Compilation', value: 'TorchScript', note: '+ Intel OpenVINO IR export' },
      { label: 'Runtime Weight', value: '<50 MB', note: 'PyWebView + FastAPI backend' },
    ],
    highlights: [
      {
        icon: Sparkles,
        title: 'SAM-Assisted Auto-Segmentation',
        description:
          'Embeds Meta Segment Anything Model (SAM) locally for single-click polygonal segmentation, cutting manual annotation effort by ~75%.',
      },
      {
        icon: Layers,
        title: 'Automated Stream Frame Extractor',
        description:
          'One-click automated frame extraction directly from live RTSP network streams and USB camera inputs for instantaneous dataset creation.',
      },
      {
        icon: Cpu,
        title: 'Hardware IR & Silicon Export',
        description:
          'One-click compilation and quantization directly targeting TorchScript traces and Intel OpenVINO IR formats for embedded Intel and ARM NPUs.',
      },
    ],
    stack: ['Python', 'PyTorch (CUDA)', 'Ultralytics YOLO', 'Meta SAM', 'OpenCV', 'FastAPI', 'PyWebView', 'OpenVINO', 'JavaScript'],
    files: [
      { name: '100% Offline Model Studio', meta: 'Zero Cloud Cost · Local GPU', art: 'dusk' },
      { name: 'SAM Polygonal Auto-Segmentation', meta: 'Single-Click · ~75% Time Cut', art: 'verdant' },
      { name: 'Direct Stream Frame Extractor', meta: 'RTSP Network · USB Feeds', art: 'aurora' },
      { name: 'Hardware IR & Silicon Export', meta: 'TorchScript · Intel OpenVINO', art: 'ember' },
    ],
    linkedinSubject: 'Inquiry: Vision Studio Offline Architecture Demo',
    emailSubject: 'Inquiry: Vision Studio Architecture Demo - Aditya Rasal',
  },
};

export function Projects() {
  const [activeProjectId, setActiveProjectId] = useState('vision-flow');
  const [selectedFile, setSelectedFile] = useState(null);

  const activeProject = PROJECTS_DATA[activeProjectId];

  const handleSelectProject = (id) => {
    setActiveProjectId(id);
    setSelectedFile(null);
  };

  return (
    <section id="projects" className="relative mx-auto max-w-7xl px-6 py-28 md:py-32">
      <GhostNumber depth={0.4} className="-top-8 left-0">
        02
      </GhostNumber>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          index={2}
          label="Platforms"
          title="Flagship Projects"
          subtitle="Autonomous Edge AI & Computer Vision Systems"
          align="left"
          className="mb-0"
        />
        <div className="flex items-center gap-2">
          <span className="relative inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
            <BracketCorners cornerClassName="h-2 w-2 border-signal/60" />
            <Sparkles className="h-3 w-3 text-signal" />
            Interactive 3D Folders
          </span>
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-dim md:text-base">
        Click on any folder or its interior files to open and inspect the underlying system architecture,
        telemetry benchmarks, and production edge deployment highlights.
      </p>

      {/* Apple-style Segmented Control Switcher for Instant Wayfinding & Direct Manipulation */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-full border border-white/[0.08] bg-black/40 p-1.5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <button
            type="button"
            onClick={() => handleSelectProject('vision-flow')}
            className={cn(
              'relative rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none active:scale-95',
              activeProjectId === 'vision-flow' ? 'text-white font-semibold' : 'text-dim hover:text-ash',
            )}
          >
            {activeProjectId === 'vision-flow' && (
              <motion.div
                layoutId="activeProjectCapsule"
                className="absolute inset-0 rounded-full bg-signal/20 border border-signal/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              01 / Vision Flow
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectProject('vision-studio')}
            className={cn(
              'relative rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none active:scale-95',
              activeProjectId === 'vision-studio' ? 'text-white font-semibold' : 'text-dim hover:text-ash',
            )}
          >
            {activeProjectId === 'vision-studio' && (
              <motion.div
                layoutId="activeProjectCapsule"
                className="absolute inset-0 rounded-full bg-purple-500/20 border border-purple-500/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              02 / Vision Studio
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Folders Showcase */}
      <div className="mt-14 grid grid-cols-1 items-center justify-items-center gap-10 md:grid-cols-2 lg:gap-14">
        {/* Project 1: Vision Flow */}
        <div
          className={cn(
            'flex flex-col items-center rounded-2xl p-6 transition-all duration-300',
            activeProjectId === 'vision-flow'
              ? 'bg-graphite/70 ring-1 ring-signal/40 shadow-[0_0_40px_rgba(255,87,34,0.1)]'
              : 'bg-void/40 hover:bg-graphite/40',
          )}
          onClick={() => handleSelectProject('vision-flow')}
        >
          <div className="mb-4 flex w-full items-center justify-between px-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal">
              [ 01 / Production Edge AI ]
            </span>
            <span className="rounded-full border border-signal/30 bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
              ~45ms Latency
            </span>
          </div>

          <GlassFolder
            label="VISION FLOW"
            meta="Edge AI Live Detection"
            accentColor="#ff5722"
            files={PROJECTS_DATA['vision-flow'].files}
            width={340}
            open={activeProjectId === 'vision-flow'}
            onOpenChange={(isOpen) => {
              if (isOpen) setActiveProjectId('vision-flow');
            }}
            onFileSelect={(file) => {
              setActiveProjectId('vision-flow');
              setSelectedFile(file);
            }}
            menu={[
              {
                label: 'Request Demo via LinkedIn',
                onSelect: () =>
                  window.open(
                    `https://www.linkedin.com/in/adityarasal007`,
                    '_blank',
                  ),
              },
              {
                label: 'Inquire via Email',
                onSelect: () =>
                  window.open(
                    `mailto:adityadrasal007@gmail.com?subject=${encodeURIComponent(
                      PROJECTS_DATA['vision-flow'].emailSubject,
                    )}`,
                    '_blank',
                  ),
              },
            ]}
          />

          <div className="mt-6 flex w-full items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span className="font-mono text-xs text-ash">Vision Flow</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectProject('vision-flow');
              }}
              className="group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-signal hover:underline cursor-pointer"
            >
              Inspect Specs
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Project 2: Vision Studio */}
        <div
          className={cn(
            'flex flex-col items-center rounded-2xl p-6 transition-all duration-300',
            activeProjectId === 'vision-studio'
              ? 'bg-graphite/70 ring-1 ring-purple-500/40 shadow-[0_0_40px_rgba(139,92,246,0.1)]'
              : 'bg-void/40 hover:bg-graphite/40',
          )}
          onClick={() => handleSelectProject('vision-studio')}
        >
          <div className="mb-4 flex w-full items-center justify-between px-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-purple-400">
              [ 02 / Offline Model Studio ]
            </span>
            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-purple-300">
              Zero Cloud Cost
            </span>
          </div>

          <GlassFolder
            label="VISION STUDIO"
            meta="Offline Model Studio"
            accentColor="#8b5cf6"
            files={PROJECTS_DATA['vision-studio'].files}
            width={340}
            open={activeProjectId === 'vision-studio'}
            onOpenChange={(isOpen) => {
              if (isOpen) setActiveProjectId('vision-studio');
            }}
            onFileSelect={(file) => {
              setActiveProjectId('vision-studio');
              setSelectedFile(file);
            }}
            menu={[
              {
                label: 'Request Demo via LinkedIn',
                onSelect: () =>
                  window.open(
                    `https://www.linkedin.com/in/adityarasal007`,
                    '_blank',
                  ),
              },
              {
                label: 'Inquire via Email',
                onSelect: () =>
                  window.open(
                    `mailto:adityadrasal007@gmail.com?subject=${encodeURIComponent(
                      PROJECTS_DATA['vision-studio'].emailSubject,
                    )}`,
                    '_blank',
                  ),
              },
            ]}
          />

          <div className="mt-6 flex w-full items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-mono text-xs text-ash">Vision Studio</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectProject('vision-studio');
              }}
              className="group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-purple-400 hover:underline cursor-pointer"
            >
              Inspect Specs
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Project Full Architecture Dossier */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProject.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ type: 'spring', stiffness: 280, damping: 25 }}
          className="mt-12 rounded-2xl border border-white/[0.08] bg-[#121214]/90 p-6 md:p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_20px_50px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          {/* Header Row */}
          <div className="flex flex-col gap-6 border-b border-line/60 pb-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Flagship Brand Logo Emblem — Beautifully Presented in Dossier Block */}
              <div
                className="relative shrink-0 overflow-hidden rounded-2xl border p-2.5 shadow-2xl backdrop-blur-xl transition-all"
                style={{
                  backgroundColor: '#0c0d12',
                  borderColor: `${activeProject.accentColor}40`,
                  boxShadow: `0 12px 32px -8px ${activeProject.accentColor}30, inset 0 1px 0 0 rgba(255,255,255,0.18)`,
                }}
              >
                <img
                  src={activeProject.image}
                  alt={`${activeProject.title} Brand Logo`}
                  className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-xl object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-xs uppercase tracking-[0.25em] font-semibold"
                    style={{ color: activeProject.accentColor }}
                  >
                    {activeProject.badge}
                  </span>
                  {selectedFile && (
                    <span className="rounded-full border border-signal/40 bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] text-signal">
                      Viewing: {selectedFile.name}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-geist text-3xl font-extrabold tracking-[-0.03em] text-ash md:text-4xl">
                  {activeProject.title}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-dim md:text-sm">
                  {activeProject.subtitle}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed tracking-[-0.005em] text-dim md:text-base">
                  {activeProject.tagline}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons with Instant Tactile Feedback */}
            <div className="flex flex-wrap items-center gap-3 lg:shrink-0 pt-2 lg:pt-0">
              <motion.a
                href="https://www.linkedin.com/in/adityarasal007"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -1.5, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="inline-flex items-center gap-2 rounded-xl border border-signal/40 bg-signal/15 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-signal shadow-[0_2px_12px_rgba(255,178,36,0.15)] transition-colors hover:bg-signal hover:text-black cursor-pointer"
              >
                <FaLinkedinIn className="h-4 w-4" />
                Request Demo
              </motion.a>
              <motion.a
                href={`mailto:adityadrasal007@gmail.com?subject=${encodeURIComponent(
                  activeProject.emailSubject,
                )}`}
                whileHover={{ y: -1.5, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-ash shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-colors hover:border-signal/40 hover:text-signal cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                Email Inquiry
              </motion.a>
            </div>
          </div>

          {/* Key Engineering Metrics */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {activeProject.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-line/60 bg-void/50 p-4 transition-colors hover:border-signal/30"
              >
                <p className="font-geist text-2xl font-bold tracking-tight text-ash md:text-3xl">
                  {metric.value}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-signal">
                  {metric.label}
                </p>
                <p className="mt-0.5 text-xs text-dim">{metric.note}</p>
              </div>
            ))}
          </div>

          {/* Implementation Highlights */}
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {activeProject.highlights.map((item) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-line/60 bg-panel/60 p-5 transition-all hover:border-signal/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-void text-signal">
                    <ItemIcon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 font-geist text-base font-bold text-ash">{item.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-dim">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Tech Stack Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line/60 pt-6">
            <span className="font-mono text-xs uppercase tracking-wider text-dim mr-2">
              Technology Stack:
            </span>
            {activeProject.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line bg-void px-3 py-1 font-mono text-xs text-ash"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

export default Projects;
