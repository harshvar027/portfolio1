/**
 * Edit this file to update copy — layout and styles live in components.
 */

export const hero = {
  title: "[YOUR NAME].exe",
  subtitle: "[YOUR TAGLINE]",
}

export const about = {
  bio: `[WRITE YOUR BIO HERE — age, city, what you're into]`,
  skills: ["Next.js", "TypeScript", "Three.js", "Something Else"],
  /** Set to your profile or leave as "#" */
  linkHref: "#",
  linkLabel: "About ↗",
}

export const projects = [
  {
    title: "Project One",
    description: "Short description of your first project.",
    color: "#00f5ff",
    position: [-4, 1, 0] as [number, number, number],
  },
  {
    title: "Project Two",
    description: "Short description of your second project.",
    color: "#ff00ff",
    position: [0, 1.5, 2] as [number, number, number],
  },
  {
    title: "Project Three",
    description: "Short description of your third project.",
    color: "#5555ff",
    position: [4, 1, 0] as [number, number, number],
  },
]

export const techStack = [
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178c6" },
  { name: "React", color: "#61dafb" },
  { name: "Three.js", color: "#00f5ff" },
  { name: "R3F + Drei", color: "#ff00ff" },
  { name: "Tailwind CSS", color: "#38bdf8" },
]

/** Same card treatment as projects — name + one funny line */
export const friends = [
  {
    title: "Friend A",
    description: "Funny line about them (edit me).",
    color: "#00f5ff",
    position: [-4, 1, 0] as [number, number, number],
  },
  {
    title: "Friend B",
    description: "Another roast — keep it kind.",
    color: "#ff00ff",
    position: [0, 1.5, 2] as [number, number, number],
  },
  {
    title: "Friend C",
    description: "They still owe you pizza.",
    color: "#5555ff",
    position: [4, 1, 0] as [number, number, number],
  },
]

/** Floating 3D hobby tags — label + accent color */
export const hobbies = [
  { label: "Hobby 1", color: "#00f5ff", shape: "box" as const },
  { label: "Hobby 2", color: "#ff00ff", shape: "sphere" as const },
  { label: "Hobby 3", color: "#5555ff", shape: "torus" as const },
  { label: "Hobby 4", color: "#00ffaa", shape: "box" as const },
  { label: "Hobby 5", color: "#ff5500", shape: "sphere" as const },
]

/** Nav order + scroll jump targets (0–1). Keep sorted by `progress`. */
export const sectionNav = [
  { id: "intro", label: "Home", progress: 0 },
  { id: "about", label: "About", progress: 1 / 6 },
  { id: "projects", label: "Projects", progress: 2 / 6 },
  { id: "tech", label: "Tech", progress: 3 / 6 },
  { id: "friends", label: "Friends", progress: 4 / 6 },
  { id: "likes", label: "What I Like", progress: 5 / 6 },
] as const

/** First letter for the nav logo placeholder — change when you add your name */
export const navLogoLetter = "Y"

/** Visibility windows for 3D sections — tweak if a section appears too early/late */
export const scrollStarts = {
  about: 0.1,
  projects: 0.26,
  tech: 0.42,
  friends: 0.58,
  likes: 0.74,
} as const

/** Scene depth: groups sit along -Z; camera uses `cameraZScrollMultiplier` in cyber-scene */
export const sceneZ = {
  about: -16,
  projects: -33,
  tech: -50,
  friends: -67,
  likes: -84,
} as const
