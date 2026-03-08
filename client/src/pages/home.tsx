import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import Navbar from "@/components/navbar";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  Download,
  Dribbble,
  Mail,
  ChevronDown,
  Copy,
  Phone,
  Linkedin,
  Twitter,
  Globe,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import {
  AtSignIcon,
  AtSignIconHandle,
  DownloadIcon,
  DownloadIconHandle,
  DribbbleIcon,
  DribbbleIconHandle,
  TwitterIcon,
  TwitterIconHandle,
} from "lucide-animated";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Cursor, CursorFollow, CursorProvider } from "@/components/ui/cursor";
import {
  containerVariants,
  itemVariants,
  wordContainerVariants,
  charVariants,
  iconBounceVariants,
  imageHoverScale,
  grayscaleHover,
  transition,
  storyCardHover,
} from "@/tokens/animation";
import { layout, componentLayout } from "@/tokens/spacing";
import {
  textPreset,
  cardPreset,
  interactivePreset,
  pagePreset,
} from "@/tokens/components";
import { bodyFontStyle } from "@/tokens/typography";
import profileImg from "@assets/image_1772896095217.png";
import project1 from "@/assets/images/project1.png";
import project2 from "@/assets/images/project2.png";
import project3 from "@/assets/images/project3.png";
import project4 from "@/assets/images/project4.png";
import recommender1 from "/images/recommender-1.jpg";
import story1 from "@/assets/images/story-1.jpg";
import story2 from "@/assets/images/story-2.jpg";
import story3 from "@/assets/images/story-3.jpg";
import story4 from "@/assets/images/story-4.jpg";

export default function Home() {
  const [, navigate] = useLocation();
  const atSignRef = useRef<AtSignIconHandle>(null);
  const downloadRef = useRef<DownloadIconHandle>(null);
  const dribbbleRef = useRef<DribbbleIconHandle>(null);
  const twitterRef = useRef<TwitterIconHandle>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // Dino Game State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<{ id: number; x: number }[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  const jump = useCallback(() => {
    if (isGameOver) {
      setIsPlaying(true);
      setIsGameOver(false);
      setScore(0);
      setObstacles([]);
      setDinoY(0);
      setIsJumping(false);
      return;
    }
    if (!isPlaying) {
      setIsPlaying(true);
      setScore(0);
      setObstacles([]);
      setDinoY(0);
      setIsJumping(false);
      return;
    }
    if (isJumping) return;

    setIsJumping(true);
    let velocity = 12; // Reduced jump power for a more natural feel
    const gravity = 0.6; // Smoother gravity for better control
    let currentY = 0;

    const jumpFrame = () => {
      currentY += velocity;
      velocity -= gravity;

      if (currentY <= 0) {
        setDinoY(0);
        setIsJumping(false);
        return;
      }

      setDinoY(currentY);
      requestAnimationFrame(jumpFrame);
    };
    requestAnimationFrame(jumpFrame);
  }, [isPlaying, isGameOver, isJumping]); // Added isJumping to dependencies

  useEffect(() => {
    if (!isPlaying || isGameOver) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const update = (time: number) => {
      if (lastTimeRef.current !== undefined) {
        const deltaTime = Math.min(time - lastTimeRef.current, 32); // Cap delta time to prevent huge skips

        setScore((prev) => prev + 1);

        setObstacles((prev) => {
          const newObstacles = prev
            .map((obs) => ({ ...obs, x: obs.x - 0.45 * deltaTime })) // Slightly faster obstacles
            .filter((obs) => obs.x > -100);

          // Spawn new obstacles with better spacing logic
          const lastObsX =
            newObstacles.length > 0
              ? newObstacles[newObstacles.length - 1].x
              : 0;
          if (
            newObstacles.length === 0 ||
            (lastObsX < 400 && Math.random() < 0.03)
          ) {
            newObstacles.push({ id: Date.now(), x: 800 }); // Spawn further out
          }

          // Dino is at x=48 (left-12 with 40px width)
          // Obstacle is at obs.x with 24px width
          const dinoLeft = 48;
          const dinoRight = 88;
          // The dino is visually offset by 48px in the motion.div (animate={{ y: -dinoY - 48 }})
          // But dinoY represents the jump height above the ground.
          // Ground is at bottom-12.
          const dinoBottom = dinoY;

          for (const obs of newObstacles) {
            const obsLeft = obs.x;
            const obsRight = obs.x + 24;
            const obsTop = 30; // The cactus height is roughly 30-36px

            // COLLISION LOGIC:
            // 1. Dino's right side is past obstacle's left side
            // 2. Dino's left side hasn't passed obstacle's right side
            // 3. Dino's bottom is NOT high enough to clear the obstacle top
            // Very lenient collision: only hit if almost completely overlapping and low
            if (
              dinoRight - 28 > obsLeft &&
              dinoLeft + 28 < obsRight &&
              dinoBottom < obsTop - 15
            ) {
              setIsGameOver(true);
              setIsPlaying(false);
              setHighScore((current) =>
                Math.max(current, Math.floor(score / 10)),
              );
            }
          }

          return newObstacles;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = undefined;
    };
  }, [isPlaying, isGameOver]); // Removed dinoY and score from dependencies to prevent effect restart on every frame

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  const experiences = [
    {
      year: "2025",
      company: "Apple",
      role: "Staff Product Designer",
      description:
        "Leading design initiatives for core ecosystem products, focusing on seamless cross-device experiences and next-generation interface patterns.",
    },
    {
      year: "2024",
      company: "Apple",
      role: "Lead Product Designer",
      description:
        "Spearheaded the redesign of iCloud services, improving user engagement by 40% through simplified sharing workflows and enhanced visual hierarchy.",
    },
    {
      year: "2023",
      company: "Apple",
      role: "Product Designer II",
      description:
        "Contributed to the development of new accessibility features within iOS, ensuring inclusive design across all system-level components.",
    },
  ];

  return (
    <>
      <Navbar />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`${pagePreset.wrapper} pt-24`}
      >
        <div className={pagePreset.column}>
          {/* Header Section */}
          <motion.div variants={itemVariants} className={layout.header}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <Avatar className={`${componentLayout.avatarLarge} rounded-2xl`}>
                <AvatarImage src={profileImg} className="object-cover" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <AnimatedThemeToggler className="mt-1" />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-0">
              <div>
                <h1 className={`${textPreset.pageTitle} mb-0.5`}>
                  Hey I'm Matt.
                </h1>
                <p className={`${textPreset.subtitle} font-body`}>
                  Product Designer
                </p>
              </div>
              <a
                href="#"
                className={`${textPreset.link} group/download`}
                onMouseEnter={() => downloadRef.current?.startAnimation()}
                onMouseLeave={() => downloadRef.current?.stopAnimation()}
              >
                Download resume <DownloadIcon ref={downloadRef} size={14} />
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={layout.separator}
          ></motion.div>

          {/* Contact Section */}
          <motion.div
            variants={itemVariants}
            className={`${layout.sectionCompact} flex justify-between items-center`}
          >
            <a
              href="mailto:matt@gmail.com"
              className="flex items-center gap-2 text-base text-[var(--color-tertiary)] hover:text-foreground transition-colors group"
              onMouseEnter={() => atSignRef.current?.startAnimation()}
              onMouseLeave={() => atSignRef.current?.stopAnimation()}
            >
              <AtSignIcon
                ref={atSignRef}
                size={18}
                className="transition-colors"
              />
              matt@gmail.com
            </a>
            <div className="flex items-center gap-5 text-foreground">
              <a
                href="#"
                className="hover:opacity-70 transition-opacity"
                onMouseEnter={() => dribbbleRef.current?.startAnimation()}
                onMouseLeave={() => dribbbleRef.current?.stopAnimation()}
              >
                <DribbbleIcon
                  ref={dribbbleRef}
                  size={16}
                  className="transition-colors"
                />
              </a>
              <a
                href="#"
                className="hover:opacity-70 transition-opacity"
                onMouseEnter={() => twitterRef.current?.startAnimation()}
                onMouseLeave={() => twitterRef.current?.stopAnimation()}
              >
                <TwitterIcon
                  ref={twitterRef}
                  size={16}
                  className="transition-colors"
                />
              </a>
              <a href="#" className={interactivePreset.socialLink}>
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="currentColor"
                >
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42zM24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={layout.separator}
          ></motion.div>

          {/* Intro Section */}
          <motion.div variants={itemVariants} className={layout.section}>
            <h2 className={`${textPreset.sectionHeading} mb-4`}>Intro</h2>
            <p className={`${textPreset.body} font-body`}>
              I'm a Design Engineer focused on crafting meaningful digital
              experiences where design meets code. With a strong front-end
              development and UX design background, I build scalable UI systems
              and contribute to user-centered products from concept to
              deployment.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={layout.separator}
          ></motion.div>

          {/* Experience Section */}
          <motion.div variants={itemVariants} className={layout.section}>
            <h2 className={`${textPreset.sectionHeading} mb-4`}>Experience</h2>
            <div className="space-y-1">
              {experiences.map((exp, index) => (
                <div key={index} className={interactivePreset.experienceRow}>
                  <button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    className={interactivePreset.experienceButton}
                  >
                    <div className="flex items-center gap-3">
                      <motion.span
                        animate={{ rotate: expandedIndex === index ? 45 : 0 }}
                        className="text-[var(--color-icon)] font-light text-lg leading-none mt-[1px] transition-colors group-hover:text-foreground"
                      >
                        +
                      </motion.span>
                      <span className="text-foreground">
                        <span className={textPreset.yearPrefix}>
                          {exp.year} /{" "}
                        </span>
                        {exp.company}
                      </span>
                    </div>
                    <span className={textPreset.roleText}>{exp.role}</span>
                  </button>
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={transition.accordion}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pl-7 pr-4">
                          <motion.p
                            variants={wordContainerVariants}
                            initial="hidden"
                            animate="show"
                            className={textPreset.bodySmall}
                          >
                            {exp.description
                              .split(" ")
                              .map((word, wordIndex) => (
                                <span
                                  key={wordIndex}
                                  className="inline-block whitespace-nowrap"
                                >
                                  {word.split("").map((char, charIndex) => (
                                    <motion.span
                                      key={charIndex}
                                      variants={charVariants}
                                      transition={transition.charReveal}
                                      className="inline-block"
                                    >
                                      {char}
                                    </motion.span>
                                  ))}
                                  {/* Add space after each word except the last one */}
                                  {wordIndex <
                                    exp.description.split(" ").length - 1 && (
                                    <span className="inline-block">&nbsp;</span>
                                  )}
                                </span>
                              ))}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={layout.separator}
          ></motion.div>

          {/* Projects Section */}
          <motion.div variants={itemVariants} className={layout.sectionLarge}>
            <h2 className={`${textPreset.sectionHeading} mb-4`}>Projects</h2>

            <CursorProvider>
              <div className={componentLayout.projectGrid}>
                {/* Project 1 */}
                <div
                  onClick={() => handleProjectClick("slate")}
                  className={cardPreset.projectCard}
                >
                  <div className={cardPreset.projectImage}>
                    <img
                      src={project1}
                      alt="Slate"
                      className={`w-full h-full object-cover ${imageHoverScale.className}`}
                    />
                  </div>
                  <h3 className={cardPreset.projectTitle}>Slate</h3>
                  <p className={`${cardPreset.projectDescription} font-body`}>
                    A sleek and responsive landing page designed for modern
                    startups to showcase their product.
                  </p>
                </div>

                {/* Project 2 */}
                <div
                  onClick={() => handleProjectClick("antimetal")}
                  className={cardPreset.projectCard}
                >
                  <div className={cardPreset.projectImage}>
                    <img
                      src={project2}
                      alt="Antimetal"
                      className={`w-full h-full object-cover ${imageHoverScale.className}`}
                    />
                  </div>
                  <h3 className={cardPreset.projectTitle}>Antimetal</h3>
                  <p className={`${cardPreset.projectDescription} font-body`}>
                    A dynamic, animation-focused landing page highlighting
                    creative transitions.
                  </p>
                </div>

                {/* Project 3 */}
                <div
                  onClick={() => handleProjectClick("slate")}
                  className={cardPreset.projectCard}
                >
                  <div className={cardPreset.projectImage}>
                    <img
                      src={project3}
                      alt="Financial Dashboard"
                      className={`w-full h-full object-cover ${imageHoverScale.className}`}
                    />
                  </div>
                  <h3 className={cardPreset.projectTitle}>Slate</h3>
                  <p className={`${cardPreset.projectDescription} font-body`}>
                    A sleek and responsive landing page designed for modern
                    startups to showcase their product.
                  </p>
                </div>

                {/* Project 4 */}
                <div
                  onClick={() => handleProjectClick("antimetal")}
                  className={cardPreset.projectCard}
                >
                  <div className={cardPreset.projectImage}>
                    <img
                      src={project4}
                      alt="TaskMaster"
                      className={`w-full h-full object-cover ${imageHoverScale.className}`}
                    />
                  </div>
                  <h3 className={cardPreset.projectTitle}>Antimetal</h3>
                  <p className={`${cardPreset.projectDescription} font-body`}>
                    A dynamic, animation-focused landing page highlighting
                    creative transitions.
                  </p>
                </div>
              </div>
              <CursorFollow>
                <div className={interactivePreset.cursorLabel}>
                  View Project <ArrowUpRight size={14} />
                </div>
              </CursorFollow>
            </CursorProvider>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={layout.separator}
          ></motion.div>

          {/* Recommendations Section */}
          <motion.div variants={itemVariants} className={layout.section}>
            <h2 className={`${textPreset.sectionHeading} mb-6`}>
              Recommendations
            </h2>
            <div className="space-y-6">
              {[
                {
                  name: "Jonathan Carter",
                  role: "TechStarter CTO",
                  content:
                    "Alex's ability to combine creativity with strategic thinking has transformed the way our team approaches challenges. He is good in his domain.",
                  image: recommender1,
                },
                {
                  name: "Michael Johnson",
                  role: "TechStarter CTO",
                  content:
                    "Alex's ability to combine creativity with strategic thinking has transformed the way our team approaches challenges. He is good in his domain.",
                  image: recommender1,
                },
              ].map((rec, i) => (
                <div key={i} className={cardPreset.recommendationCard}>
                  <div className="flex justify-between items-center px-6 py-4">
                    <div className="flex flex-col">
                      <h3 className="font-medium text-base text-foreground mb-1">
                        {rec.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-foreground transition-colors duration-200 hover:text-[#0077B5] dark:hover:text-[#87CEEB] cursor-pointer"
                          fill="currentColor"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span
                          className={`text-[13px] ${textPreset.yearPrefix}`}
                        >
                          {rec.role}
                        </span>
                      </div>
                    </div>
                    <Avatar
                      className={`${componentLayout.avatarLarge} rounded-none -mr-6 -my-4 transition-all duration-700`}
                    >
                      <AvatarImage src={rec.image} className="object-cover" />
                      <AvatarFallback>{rec.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="p-0">
                    <div className={cardPreset.recommendationQuote}>
                      <p className="text-muted-foreground text-sm md:text-[15px] leading-relaxed font-body">
                        {rec.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={layout.separator}
          ></motion.div>

          {/* My Story Section */}
          <motion.div variants={itemVariants} className={layout.sectionLarge}>
            <h2 className={`${textPreset.sectionHeading} mb-6`}>My Story</h2>

            <div className="relative mb-8 h-56 flex items-center justify-center">
              <motion.div
                initial={{ rotate: -8, x: -120, y: 0 }}
                {...storyCardHover}
                className="absolute w-32 h-40 rounded-xl overflow-hidden border-4 border-[var(--color-surface-elevated)] shadow-lg z-0"
              >
                <img
                  src={story1}
                  alt="My workspace"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ rotate: 12, x: -40, y: 15 }}
                {...storyCardHover}
                className="absolute w-36 h-36 rounded-xl overflow-hidden border-4 border-[var(--color-surface-elevated)] shadow-lg z-10"
              >
                <img
                  src={story2}
                  alt="Designing"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ rotate: -5, x: 40, y: -10 }}
                {...storyCardHover}
                className="absolute w-32 h-40 rounded-xl overflow-hidden border-4 border-[var(--color-surface-elevated)] shadow-lg z-20"
              >
                <img
                  src={story3}
                  alt="Coffee and notes"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ rotate: 8, x: 120, y: 20 }}
                {...storyCardHover}
                className="absolute w-36 h-36 rounded-xl overflow-hidden border-4 border-[var(--color-surface-elevated)] shadow-lg z-30"
              >
                <img
                  src={story4}
                  alt="Creative studio"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            <div className={`space-y-6 ${textPreset.body}`}>
              <p>
                I'm David Simmons, a passionate digital designer and no-code
                developer who bridges creativity with technology. Currently
                exploring new ways to craft meaningful digital experiences, I'm
                driven by curiosity and a love for clean, purposeful design.
              </p>
              <p>
                I thrive on transforming ideas into reality — whether it's
                shaping intuitive interfaces, crafting distinctive brand
                identities, designing immersive visuals, or building websites
                that feel effortless to use.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={layout.separator}
          ></motion.div>

          {/* Stack Section */}
          <motion.div variants={itemVariants} className={layout.section}>
            <h2 className={`${textPreset.sectionHeading} mb-6`}>Stack</h2>
            <div className="flex flex-wrap gap-6 items-center">
              {[
                { name: "Figma", icon: "/tools/image 4.png" },
                { name: "Notion", icon: "/tools/image 5.png" },
                { name: "Raycast", icon: "/tools/image 6.png" },
                { name: "Framer", icon: "/tools/image 7.png" },
                { name: "Linear", icon: "/tools/image 8.png" },
                { name: "Slack", icon: "/tools/image 9.png" },
                { name: "Arc", icon: "/tools/image 10.png" },
              ].map((tool, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className={interactivePreset.stackIcon}
                >
                  <img
                    src={tool.icon}
                    alt={tool.name}
                    className={`w-full h-full object-contain ${grayscaleHover.className}`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={layout.separator}
          ></motion.div>

          {/* Contact Section (Grid) */}
          <motion.div variants={itemVariants} className={layout.section}>
            <h2 className={`${textPreset.sectionHeading} mb-6`}>Contact</h2>
            <div className={`${componentLayout.contactGridHalf} mb-3`}>
              <motion.div whileHover="hover" initial="rest" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className={cardPreset.actionButton}
                >
                  <span className={textPreset.actionLabel}>Copy mail</span>
                  <motion.div
                    variants={iconBounceVariants(15)}
                    transition={transition.spring}
                  >
                    <AtSignIcon size={14} className={textPreset.actionIcon} />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div whileHover="hover" initial="rest" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className={cardPreset.actionButton}
                >
                  <span className={textPreset.actionLabel}>Copy phone</span>
                  <motion.div
                    variants={iconBounceVariants(-15)}
                    transition={transition.spring}
                  >
                    <Phone size={14} className={textPreset.actionIcon} />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
            <div className={`${componentLayout.contactGridQuarter} mb-3`}>
              <motion.div whileHover="hover" initial="rest" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className={cardPreset.actionButton}
                >
                  <span className={textPreset.actionLabel}>Linkedin</span>
                  <motion.div
                    variants={iconBounceVariants(-10)}
                    transition={transition.spring}
                  >
                    <Linkedin size={14} className={textPreset.actionIcon} />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div whileHover="hover" initial="rest" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className={cardPreset.actionButton}
                >
                  <span className={textPreset.actionLabel}>Dribbble</span>
                  <motion.div
                    variants={iconBounceVariants(20)}
                    transition={transition.spring}
                  >
                    <DribbbleIcon size={14} className={textPreset.actionIcon} />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div whileHover="hover" initial="rest" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className={cardPreset.actionButton}
                >
                  <span className={textPreset.actionLabel}>X</span>
                  <motion.div
                    variants={iconBounceVariants(-20)}
                    transition={transition.spring}
                  >
                    <TwitterIcon size={14} className={textPreset.actionIcon} />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div whileHover="hover" initial="rest" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className={cardPreset.actionButton}
                >
                  <span className={textPreset.actionLabel}>Medium</span>
                  <motion.div
                    variants={iconBounceVariants(15)}
                    transition={transition.spring}
                  >
                    <Globe size={14} className={textPreset.actionIcon} />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
            <motion.div whileHover="hover" initial="rest" className="w-full">
              <Button
                variant="outline"
                size="sm"
                className={cardPreset.actionButton}
              >
                <span className={textPreset.actionLabel}>View resume</span>
                <motion.div
                  variants={iconBounceVariants(-15)}
                  transition={transition.spring}
                >
                  <FileText size={14} className={textPreset.actionIcon} />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={layout.separator}
          ></motion.div>

          {/* Dino Game Section */}
          <motion.div
            variants={itemVariants}
            className="relative flex flex-col items-center justify-center overflow-hidden border-b border-[var(--color-divider-dashed)]/50"
          >
            <div className="absolute top-6 left-8 right-8 flex justify-between z-10 text-[var(--color-heading)] pointer-events-none">
              <span className={textPreset.micro}>
                {isGameOver
                  ? "Game Over"
                  : isPlaying
                  ? "Playing"
                  : "Tap to play"}
              </span>
              <div className="flex gap-4">
                <span>HI {String(highScore).padStart(5, "0")}</span>
                <span>{String(Math.floor(score / 10)).padStart(5, "0")}</span>
              </div>
            </div>

            <div
              ref={gameRef}
              onClick={jump}
              className="w-full h-48 relative flex items-end overflow-hidden cursor-pointer select-none bg-black/[0.015] dark:bg-white/[0.03] transition-colors hover:bg-black/[0.025] dark:hover:bg-white/[0.05]"
            >
              {/* Ground Line */}
              <div className="absolute bottom-12 left-0 w-full h-[1px] bg-[var(--color-divider-dashed)]"></div>

              {/* Dino */}
              <motion.div
                animate={{ y: -dinoY - 48 }}
                transition={{ type: "tween", duration: 0 }}
                className="absolute left-12 bottom-0 mb-[-2px] z-20 dino-game"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 54 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-sm"
                >
                  <path
                    d="M45.4502 6.75024V8.55005H47.25V18.7317H35.1006V20.2502H40.5V21.5999H35.1006V25.6497H39.1504V29.7004H37.3506V27.8997H35.1006V34.6497H33.2998V37.8H31.0498V40.05H29.25V48.1497H31.0498V49.9504H27.4502L27 43.6497H25.6504V41.8499H23.4004V43.6497H21.1504V45.8997H18.9004V48.1497H21.1504V49.9504H17.1006V41.8499H14.8506V40.05H13.0498V37.8H10.7998V35.55H9V33.3H7.2002V22.05H9V25.6497H10.7998V27.8997H13.0498V29.7004H17.1006V27.8997H19.3506V25.6497H22.0498V23.8499H25.2002V21.5999H27.1689L27.4502 8.55005H29.25V6.30005L45.4502 6.75024ZM31.0498 10.3499V14.8499H35.5498V10.3499H31.0498ZM34.6504 11.2502V13.9504H31.9502V11.2502H34.6504Z"
                    className="dino-color"
                  />
                  {isPlaying && !isJumping && (
                    <motion.path
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                      d="M18.9004 48.1497H21.1504V49.9504H17.1006V41.8499M29.25 48.1497H31.0498V49.9504H27.4502L27 43.6497"
                      fill="#F0EDE7"
                    />
                  )}
                </svg>
              </motion.div>

              {/* Obstacles */}
              {obstacles.map((obs) => (
                <div
                  key={obs.id}
                  className="absolute bottom-12 mb-[-2px] z-10 dino-game"
                  style={{ left: `${obs.x}px` }}
                >
                  <svg
                    width="24"
                    height="36"
                    viewBox="0 0 20 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 30H12V0H8V30Z" className="dino-color" />
                    <path d="M4 10H8V14H4V10Z" className="dino-color" />
                    <path d="M12 5H16V9H12V5Z" className="dino-color" />
                  </svg>
                </div>
              ))}

              {/* Decorative Background Elements */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-divider-dashed)]/30 to-transparent -translate-y-12"></div>

              {isGameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px] z-30">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[var(--color-surface-elevated)]/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-xl flex flex-col items-center gap-2"
                  >
                    <span
                      className={`${textPreset.subSectionHeading} tracking-[0.2em]`}
                    >
                      Game Over
                    </span>
                    <div className="flex flex-col items-center group">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[var(--color-icon)] mb-1 transition-transform group-hover:rotate-180 duration-500"
                      >
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                      <span className="text-[9px] font-medium text-[var(--color-icon)] uppercase tracking-widest">
                        Tap to Restart
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
