import type { ProjectCardData } from "./sketchTypes"

export type PortfolioProject = ProjectCardData

export interface ResearchLink {
  label: string
  href: string
}

export interface ResearchPublication {
  id: string
  year: string
  title: string
  authors: string
  venue: string
  type: "Journal" | "Conference" | "Poster"
  summary: string
  links: ResearchLink[]
}

export interface ResearchOutput {
  id: string
  label: string
  title: string
  description: string
  status: string
}

export const baseCoordinate = "42.3601° N, 71.0942° W"
export const coordinatePlace = "Building in Cambridge MA"
export const contactHref = "mailto:dwootton@mit.edu"

export const researchPublications: ResearchPublication[] = [
  {
    id: "charting-eda",
    year: "2025",
    title:
      "Charting EDA: Characterizing Interactive Visualization Use in Computational Notebooks with a Mixed-Methods Formalism",
    authors: "Dylan Wootton, Amy Fox, Evan Peck, Arvind Satyanarayan",
    venue: "IEEE TVCG 31(1), IEEE VIS 2024",
    type: "Journal",
    summary:
      "A mixed-methods formalism for studying how interactive visualizations shape observations in computational notebooks.",
    links: [
      {
        label: "DOI",
        href: "https://doi.org/10.1109/TVCG.2024.3456217",
      },
      {
        label: "Project",
        href: "https://vis.csail.mit.edu/pubs/charting-eda/",
      },
    ],
  },
  {
    id: "revisit",
    year: "2021",
    title:
      "reVISit: Looking Under the Hood of Interactive Visualization Studies",
    authors:
      "Carolina Nobre, Dylan Wootton, Zach Cutler, Lane Harrison, Hanspeter Pfister, Alexander Lex",
    venue: "ACM CHI 2021",
    type: "Conference",
    summary:
      "An analysis system for replaying and interpreting interaction traces from complex visualization studies.",
    links: [
      {
        label: "DOI",
        href: "https://doi.org/10.1145/3411764.3445382",
      },
      {
        label: "PDF",
        href: "https://www.dylanwootton.com/papers/2021_chi_revisit.pdf",
      },
      {
        label: "Code",
        href: "https://github.com/visdesignlab/revisit/",
      },
    ],
  },
  {
    id: "mvnv-study",
    year: "2020",
    title:
      "Evaluating Multivariate Network Visualization Techniques Using a Validated Design and Crowdsourcing Approach",
    authors: "Carolina Nobre, Dylan Wootton, Lane Harrison, Alexander Lex",
    venue: "ACM CHI 2020",
    type: "Conference",
    summary:
      "A crowdsourced study comparing node-link and matrix representations for multivariate network analysis tasks.",
    links: [
      {
        label: "DOI",
        href: "https://doi.org/10.1145/3313831.3376381",
      },
      {
        label: "Project",
        href: "https://vdl.sci.utah.edu/publications/2020_chi_mvnv_study/",
      },
    ],
  },
  {
    id: "arctic-explorer",
    year: "2019",
    title:
      "Arctic Explorer: Visualization of Sea-Ice Concentration along Arctic Shipping Routes",
    authors: "Dylan Wootton, Ethan Ransom, Alexander Lex",
    venue: "IEEE InfoVis Posters 2019",
    type: "Poster",
    summary:
      "An interactive route-planning visualization for exploring sea-ice concentration along Arctic shipping paths.",
    links: [
      {
        label: "PDF",
        href: "https://www.dylanwootton.com/papers/2019_infovis_arctic_explorer.pdf",
      },
      {
        label: "Code",
        href: "https://github.com/dwootton/Arctic-Explorer",
      },
    ],
  },
]

export const researchOutputs: ResearchOutput[] = [
  {
    id: "cellql",
    label: "Notebook IR",
    title: "CellQL",
    description:
      "A SQL-derived intermediate representation for comparing what happens across notebook analyses.",
    status: "In progress",
  },
  {
    id: "meros",
    label: "Interaction grammar",
    title: "Meros",
    description:
      "A grammar for describing and composing direct-manipulation interaction behavior.",
    status: "In progress",
  },
  {
    id: "affordancebench",
    label: "AI evaluation",
    title: "AffordanceBench",
    description:
      "An empirical study of how tool documentation changes LLM behavior in situated interface tasks.",
    status: "In progress",
  },
  {
    id: "ip",
    label: "Patents and IP",
    title: "Public patent record",
    description:
      "Public patent entries are intentionally left out until there are verified records to list.",
    status: "Available on request",
  },
]

export const selectedProjects: PortfolioProject[] = [
  {
    id: "model-compass",
    href: "/projects/#model-compass",
    kicker: "PROTOTYPES",
    title: "Model Compass",
    description:
      "A research tool for exploring LLM behavior across tasks, prompts, and model families.",
    tags: ["Prototype", "Visualization", "Python", "React"],
    thumbnailType: "model-compass",
    accent: "green",
  },
  {
    id: "pathfinder",
    href: "/projects/#pathfinder",
    kicker: "PROTOTYPES",
    title: "Pathfinder",
    description:
      "An AI-powered learning companion that adapts to your knowledge and supports deliberate practice.",
    tags: ["Product Design", "Interaction", "Evaluation"],
    thumbnailType: "pathfinder",
    accent: "copper",
  },
  {
    id: "systems-sandbox",
    href: "/projects/#systems-sandbox",
    kicker: "PROTOTYPES",
    title: "Systems Sandbox",
    description:
      "A flexible environment for prototyping interactions and studying complex socio-technical systems.",
    tags: ["Systems Design", "Prototyping", "D3", "TypeScript"],
    thumbnailType: "systems-sandbox",
    accent: "blue",
  },
]

export const cardLabProjects: PortfolioProject[] = [
  ...selectedProjects,
  {
    id: "interface-atlas",
    href: "/projects/#interface-atlas",
    kicker: "PROTOTYPES",
    title: "Interface Atlas",
    description:
      "A browsable map of interaction patterns, prototypes, and reusable design arguments.",
    tags: ["Atlas", "Research", "Interaction"],
    thumbnailType: "map",
    accent: "copper",
  },
  {
    id: "capability-loops",
    href: "/projects/#capability-loops",
    kicker: "PROTOTYPES",
    title: "Capability Loops",
    description:
      "A dashboard for tracing how tools change user skill, judgment, and agency over time.",
    tags: ["Evaluation", "Dashboard", "Metrics"],
    thumbnailType: "dashboard",
    accent: "green",
  },
  {
    id: "prompt-cartographer",
    href: "/projects/#prompt-cartographer",
    kicker: "PROTOTYPES",
    title: "Prompt Cartographer",
    description:
      "A map-based workspace for comparing prompt families, failures, and transfer patterns.",
    tags: ["Prompting", "Map", "Systems"],
    thumbnailType: "network",
    accent: "blue",
  },
  {
    id: "evaluation-studio",
    href: "/projects/#evaluation-studio",
    kicker: "PROTOTYPES",
    title: "Evaluation Studio",
    description:
      "A flexible environment for assembling qualitative and quantitative AI system evaluations.",
    tags: ["Benchmarks", "UX", "Research"],
    thumbnailType: "dashboard",
    accent: "slate",
  },
  {
    id: "trace-explorer",
    href: "/projects/#trace-explorer",
    kicker: "PROTOTYPES",
    title: "Trace Explorer",
    description:
      "A lightweight visual debugger for reasoning across logs, events, and interaction traces.",
    tags: ["Trace", "Visualization", "Tools"],
    thumbnailType: "timeline",
    accent: "copper",
  },
  {
    id: "learning-graph",
    href: "/projects/#learning-graph",
    kicker: "PROTOTYPES",
    title: "Learning Graph",
    description:
      "A concept graph for adaptive practice paths, reflection prompts, and knowledge gaps.",
    tags: ["Learning", "Graph", "Prototype"],
    thumbnailType: "network",
    accent: "green",
  },
  {
    id: "model-field-notes",
    href: "/projects/#model-field-notes",
    kicker: "FIELD NOTE",
    title: "Model Field Notes",
    description:
      "A notebook interface for collecting, clustering, and revisiting model behavior observations.",
    tags: ["Notebook", "AI", "Synthesis"],
    thumbnailType: "blank",
    accent: "slate",
  },
  {
    id: "interaction-lab",
    href: "/projects/#interaction-lab",
    kicker: "PROTOTYPES",
    title: "Interaction Lab",
    description:
      "A fast prototyping bench for testing direct manipulation patterns around generated content.",
    tags: ["Prototype", "Interaction", "React"],
    thumbnailType: "timeline",
    accent: "blue",
  },
  {
    id: "skill-scaffold",
    href: "/projects/#skill-scaffold",
    kicker: "PROTOTYPES",
    title: "Skill Scaffold",
    description:
      "A guided practice surface for turning opaque AI interactions into inspectable skill loops.",
    tags: ["Scaffold", "Practice", "Evaluation"],
    thumbnailType: "pathfinder",
    accent: "copper",
  },
  {
    id: "reflection-engine",
    href: "/projects/#reflection-engine",
    kicker: "PROTOTYPES",
    title: "Reflection Engine",
    description:
      "A system for turning work sessions into structured critique, next steps, and learning signals.",
    tags: ["Reflection", "Agent UX", "Timeline"],
    thumbnailType: "timeline",
    accent: "green",
  },
  {
    id: "concept-map",
    href: "/projects/#concept-map",
    kicker: "PROTOTYPES",
    title: "Concept Map",
    description:
      "A semantic sketching tool for externalizing relationships in messy technical domains.",
    tags: ["Concepts", "Map", "Research"],
    thumbnailType: "network",
    accent: "blue",
  },
  {
    id: "research-sandbox",
    href: "/projects/#research-sandbox",
    kicker: "PROTOTYPES",
    title: "Research Sandbox",
    description:
      "A controlled playground for testing study protocols, instrumentation, and interface variants.",
    tags: ["Sandbox", "Protocol", "Prototype"],
    thumbnailType: "systems-sandbox",
    accent: "slate",
  },
]
