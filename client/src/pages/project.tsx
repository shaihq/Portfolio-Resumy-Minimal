import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ChevronLeft, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { AtSignIcon } from "lucide-animated";
import { Button } from "@/components/ui/button";
import { containerVariants, itemVariants } from "@/tokens/animation";
import { layout } from "@/tokens/spacing";
import { textPreset, cardPreset, pagePreset } from "@/tokens/components";
import { bodyFontStyle } from "@/tokens/typography";
import project1 from "@/assets/images/project1.png";
import project2 from "@/assets/images/project2.png";
import project3 from "@/assets/images/project3.png";
import project4 from "@/assets/images/project4.png";
import slateImage from "@assets/image_1772894732476.png";
import contentImage from "@assets/image_1772895554431.png";

const projectsData: Record<string, any> = {
  slate: {
    id: "slate",
    title:
      "Redesigning Quote Builder at Freshworks for 1,900+ Enterprise Users",
    subtitle: "Focused on enhancing the experience for customers in the U.S.",
    description:
      "Focused on enhancing the experience for customers in the U.S.",
    image: slateImage,
    details: {
      client: "Startup Co.",
      role: "Lead Designer",
      industry: "SaaS",
      platform: "Web app",
    },
    introduction:
      "Freshsales, part of the Freshworks family, is a CRM designed to help sales teams manage leads, track deals, and close more business with less effort. It offers tools like email tracking, deal pipelines, and AI-powered insights, all aimed at making the sales process smoother and more efficient.\n\nIn this project, I'm redesigning the quote builder experience. The focus is on making it simpler and more intuitive for users to create and share quotes effortlessly. It's a meaningful update to a feature that's central to the sales workflow.",
    examples: [],
  },
  antimetal: {
    id: "antimetal",
    title: "Antimetal",
    subtitle:
      "A dynamic, animation-focused landing page highlighting creative transitions",
    description:
      "Focused on enhancing creative visual experiences for animation enthusiasts.",
    image: project2,
    details: {
      client: "Creative Studio",
      role: "Design Director",
      industry: "Entertainment",
      platform: "Web app",
    },
    introduction:
      "Antimetal pushes the boundaries of digital design through bold, carefully-crafted animations. This project demonstrates how motion design can tell a story and create memorable user experiences. Every animation serves a purpose, contributing to the overall narrative.",
    examples: [
      {
        title: "Motion Design",
        description:
          "Custom animations bring the interface to life, creating a sense of fluidity and elegance. Each transition is orchestrated to feel natural while maintaining visual interest.",
      },
      {
        title: "Visual Storytelling",
        description:
          "The design hierarchy uses motion to guide users through content progressively, making complex information feel approachable and engaging.",
      },
    ],
  },
};

export default function Project() {
  const [match, params] = useRoute("/project/:id");
  const [, navigate] = useLocation();

  const projectId = (params?.id as string)?.toLowerCase();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (!match) {
    return null;
  }

  const project = projectsData[projectId] || projectsData.slate;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={pagePreset.wrapper}
    >
      <div className={pagePreset.column}>
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className={`${layout.subHeader} flex items-center gap-3`}
        >
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-1.5 ${textPreset.yearPrefix} hover:text-foreground transition-colors group text-[13px] font-medium`}
          >
            <ChevronLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Go back
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={layout.separator}
        ></motion.div>

        {/* Project Title & Intro */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 pt-8 pb-6">
          <h1 className={`${textPreset.pageTitle} mb-3`}>{project.title}</h1>
          <p className={`${textPreset.subtitle} mb-4 font-body`}>
            {project.subtitle}
          </p>
        </motion.div>

        {/* Featured Image */}
        <motion.div variants={itemVariants} className={layout.media}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full rounded-xl overflow-hidden drop-shadow-sm border border-black/5 dark:border-white/10"
          />
        </motion.div>

        {/* Project Details */}
        <motion.div variants={itemVariants} className="px-5 md:px-8 py-5">
          <div className="flex items-center gap-2 mb-6">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[var(--color-heading)]"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <h2 className={textPreset.subSectionHeading}>Project Details</h2>
          </div>
          <div className={cardPreset.detailTable}>
            {Object.entries(project.details).map(([key, value], index) => (
              <div
                key={key}
                className={`${cardPreset.detailTableRow} ${
                  index !== Object.entries(project.details).length - 1
                    ? cardPreset.detailTableRowBorder
                    : ""
                }`}
              >
                <span
                  className={`${textPreset.detailLabel} text-[var(--color-heading)]`}
                >
                  {key}
                </span>
                <span className="text-base text-muted-foreground font-body">
                  {value as string}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={layout.separator}
        ></motion.div>

        {/* Introduction */}
        <motion.div variants={itemVariants} className={layout.section}>
          <h2 className={`${textPreset.subSectionHeading} mb-6`}>
            Introduction
          </h2>
          <div className="space-y-4 mb-6">
            {project.introduction
              .split("\n\n")
              .map((paragraph: string, idx: number) => (
                <p key={idx} className={`${textPreset.body} font-body`}>
                  {paragraph}
                </p>
              ))}
          </div>
        </motion.div>

        {/* Introduction Image */}
        <motion.div variants={itemVariants} className={layout.media}>
          <img
            src={contentImage}
            alt="Introduction visual"
            className="w-full rounded-lg overflow-hidden drop-shadow-md border border-black/5 dark:border-white/10"
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={layout.separator}
        ></motion.div>

        {/* Contact CTA / Footer */}
        <motion.div
          variants={itemVariants}
          className="px-5 md:px-8 py-5 flex flex-col items-center text-center"
        >
          <h1 className="text-[23px] font-['Cedarville_Cursive'] text-foreground mb-2">
            Mike Starves
          </h1>
          <p className="text-foreground mb-4 text-2xl font-semibold max-w-sm leading-tight">
            Got a project in mind or just curious? Let's talk.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              className={`${cardPreset.actionButton} hover:cursor-pointer`}
            >
              <span className={textPreset.actionLabel}>Copy mail</span>
              <AtSignIcon size={14} className={textPreset.actionIcon} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${cardPreset.actionButton} hover:cursor-pointer`}
            >
              <span className={textPreset.actionLabel}>Copy phone</span>
              <Phone size={14} className={textPreset.actionIcon} />
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={layout.separator}
        ></motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className={layout.footer}>
          <p className={`${textPreset.footerText} font-body`}>
            © ALL RIGHTS RESERVED.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
