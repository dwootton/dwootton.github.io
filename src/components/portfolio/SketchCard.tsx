import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import type {
  ProjectCardData,
  SketchAccent,
  SketchCardVariant,
  SketchThumbnailType,
} from "./sketchTypes"

interface SketchCardProps {
  project: ProjectCardData
  seed?: string
  variant?: SketchCardVariant
  className?: string
}

const SketchCard: React.FC<SketchCardProps> = ({ project, className }) => {
  const card = (
    <CardArticle className={className} data-has-link={project.href ? "true" : "false"}>
      <Media aria-hidden="true">
        <GeneratedThumbnail
          type={project.thumbnailType ?? "network"}
          accent={project.accent ?? "green"}
        />
      </Media>

      <Body>
        <Eyebrow>{project.kicker}</Eyebrow>

        <TitleRow>
          <Title>{project.title}</Title>
          <Arrow aria-hidden="true">
            <svg
              viewBox="0 0 28 28"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="14" x2="23" y2="14" />
              <polyline points="16 7 23 14 16 21" />
            </svg>
          </Arrow>
        </TitleRow>

        <Description>{project.description}</Description>

        {project.tags.length > 0 ? (
          <Tags>
            {project.tags.map((tag, index) => (
              <React.Fragment key={tag}>
                <Tag>{tag}</Tag>
                {index < project.tags.length - 1 ? <Dot aria-hidden="true">·</Dot> : null}
              </React.Fragment>
            ))}
          </Tags>
        ) : null}
      </Body>
    </CardArticle>
  )

  if (!project.href) return card

  return (
    <CardLink to={project.href} aria-label={`Open ${project.title}`}>
      {card}
    </CardLink>
  )
}

export const GeneratedThumbnail: React.FC<{
  type: SketchThumbnailType
  seed?: string
  accent?: SketchAccent
}> = ({ type, accent = "green" }) => {
  switch (type) {
    case "model-compass":
      return <ModelCompassPreview />
    case "pathfinder":
      return <PathfinderPreview />
    case "systems-sandbox":
      return <SystemsSandboxPreview accent={accent} />
    case "dashboard":
      return <DashboardPreview accent={accent} />
    case "map":
      return <MapPreview accent={accent} />
    case "timeline":
      return <TimelinePreview accent={accent} />
    case "blank":
      return <FieldNotePreview accent={accent} />
    case "network":
    default:
      return <NetworkPreview accent={accent} />
  }
}

function ModelCompassPreview() {
  return (
    <ModelPreview>
      <ModelRail>
        <RailMark />
        {Array.from({ length: 7 }).map((_, index) => (
          <RailIcon key={index} />
        ))}
      </ModelRail>

      <ModelGraph viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet">
        <g stroke="#9aa48f" strokeWidth="1" fill="none" opacity="0.7">
          <path d="M55,40 C90,40 95,75 130,75" />
          <path d="M155,75 C185,75 185,55 215,55" />
          <path d="M55,40 C75,40 80,110 130,110" />
          <path d="M155,110 C185,110 190,135 215,135" />
          <path d="M55,160 C90,160 95,135 130,135" />
          <path d="M155,135 C175,135 180,160 215,160" />
          <path d="M215,55 C245,55 250,95 215,95" />
        </g>
        <Node x={40} y={40} fill="#cdd5c1" label="D" />
        <Node x={140} y={75} fill="#1f3b2a" label="O" textColor="#cdd5c1" />
        <Node x={220} y={55} fill="#cdd5c1" label="A" />
        <Node x={140} y={110} fill="#1f3b2a" label="C" textColor="#cdd5c1" />
        <Node x={220} y={95} fill="#cdd5c1" label="N" />
        <Node x={220} y={135} fill="#cdd5c1" label="X" />
        <Node x={40} y={160} fill="#cdd5c1" label="P" />
        <Node x={140} y={135} fill="#1f3b2a" label="F" textColor="#cdd5c1" />
        <Node x={220} y={160} fill="#cdd5c1" label="R" />
      </ModelGraph>

      <ModelPanel>
        <PanelTitle>Model behavior</PanelTitle>
        <PanelSubcopy>
          Compare outputs across
          <br />
          prompts and models.
        </PanelSubcopy>
        <Sparkline viewBox="0 0 160 50" preserveAspectRatio="none">
          <path
            d="M0,35 C20,32 30,20 50,22 C70,24 80,40 100,30 C120,22 130,10 160,15"
            stroke="#6b8c5a"
            strokeWidth="1.2"
            fill="none"
          />
        </Sparkline>
        <PanelAxes>
          <span>Confidence</span>
          <span>Confidence</span>
        </PanelAxes>
      </ModelPanel>
    </ModelPreview>
  )
}

function Node({
  x,
  y,
  fill,
  label,
  textColor = "#1f3b2a",
}: {
  x: number
  y: number
  fill: string
  label: string
  textColor?: string
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-15" y="-10" width="30" height="20" rx="10" fill={fill} stroke="#1f3b2a" strokeWidth="0.8" />
      <text
        x="0"
        y="3.5"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="8"
        fill={textColor}
      >
        {label}
      </text>
    </g>
  )
}

function PathfinderPreview() {
  const rings = [22, 38, 56, 74, 92]
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  return (
    <PathfinderShell>
      <PathfinderList>
        <ListHeader>CONTENTS / NAVIGATION</ListHeader>
        {Array.from({ length: 6 }).map((_, index) => (
          <ListItem key={index} data-active={index === 1 ? "true" : "false"}>
            <ListBullet />
            <ListLine />
          </ListItem>
        ))}
        <ListHeader data-spaced="true">OBJECTIVES</ListHeader>
        {Array.from({ length: 3 }).map((_, index) => (
          <ListItem key={index}>
            <ListBullet />
            <ListLine />
          </ListItem>
        ))}
      </PathfinderList>

      <PathfinderGraph viewBox="-110 -110 220 220">
        {rings.map(radius => (
          <circle
            key={radius}
            r={radius}
            cx="0"
            cy="0"
            fill="none"
            stroke="rgba(214, 196, 143, 0.18)"
            strokeWidth="0.5"
          />
        ))}
        <circle r="3.2" fill="#e9d9a6" />
        {Array.from({ length: 140 }).map((_, index) => {
          const progress = index / 140
          const angle = index * goldenAngle
          const radius = 18 + progress * 80
          const cx = Math.cos(angle) * radius
          const cy = Math.sin(angle) * radius
          const isAccent = index % 11 === 0

          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={isAccent ? 1.7 : 0.9}
              fill={isAccent ? "#f0c66a" : "rgba(230, 212, 162, 0.55)"}
            />
          )
        })}
        <g stroke="rgba(240, 198, 106, 0.35)" strokeWidth="0.4" fill="none">
          <path d="M0,0 L42,-18" />
          <path d="M0,0 L-30,30" />
          <path d="M0,0 L60,40" />
          <path d="M0,0 L-55,-22" />
        </g>
      </PathfinderGraph>

      <PathfinderPanel>
        <PanelTitle>Learning path</PanelTitle>
        <StepList>
          {["Foundations", "Concept map", "Guided practice", "Reflection", "Assessment"].map(step => (
            <li key={step}>
              <StepDot />
              {step}
            </li>
          ))}
        </StepList>
        <PreviewCta>Continue</PreviewCta>
      </PathfinderPanel>
    </PathfinderShell>
  )
}

function SystemsSandboxPreview({ accent }: { accent: SketchAccent }) {
  return (
    <LightPreview data-accent={accent}>
      <FigureSvg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
        <rect x="38" y="28" width="314" height="174" rx="7" fill="rgba(255,255,255,0.58)" stroke="rgba(56,48,36,0.22)" />
        <rect x="372" y="28" width="110" height="174" rx="7" fill="rgba(255,255,255,0.5)" stroke="rgba(56,48,36,0.2)" />
        <path d="M105 122L176 78L248 128L304 92M176 78L206 164L278 164L248 128" stroke="var(--preview-accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {[
          [105, 122, "Data", "var(--preview-green)"],
          [176, 78, "Cause", "var(--preview-node)"],
          [248, 128, "Policy", "var(--preview-blue)"],
          [304, 92, "Events", "var(--preview-node)"],
          [206, 164, "Demand", "var(--preview-node)"],
          [278, 164, "Action", "var(--preview-green)"],
        ].map(([x, y, label, fill]) => (
          <PreviewPill key={String(label)} x={Number(x)} y={Number(y)} label={String(label)} fill={String(fill)} />
        ))}
        <text x="392" y="66" fill="#2b2924" fontSize="15" fontWeight="600">Simulation</text>
        <text x="392" y="91" fill="#756e62" fontSize="10">Run scenario</text>
        <rect x="394" y="108" width="25" height="19" rx="4" fill="#16221b" />
        <path d="M404 113L414 118L404 123Z" fill="#fffdf6" opacity="0.92" />
        <path d="M394 174C413 166 429 172 446 158C462 145 478 151 498 136" stroke="var(--preview-green)" strokeWidth="2" fill="none" />
      </FigureSvg>
    </LightPreview>
  )
}

function NetworkPreview({ accent }: { accent: SketchAccent }) {
  const nodes = [
    [142, 132, "A", "var(--preview-green)"],
    [188, 92, "B", "var(--preview-node)"],
    [238, 116, "C", "var(--preview-node)"],
    [274, 78, "D", "var(--preview-green)"],
    [310, 128, "E", "var(--preview-node)"],
    [210, 156, "F", "var(--preview-node)"],
    [332, 166, "G", "var(--preview-green)"],
    [365, 112, "H", "var(--preview-node)"],
  ] as const

  return (
    <LightPreview data-accent={accent}>
      <FigureSvg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
        <rect x="52" y="30" width="416" height="170" rx="7" fill="rgba(255,255,255,0.52)" stroke="rgba(56,48,36,0.22)" />
        <g stroke="var(--preview-line)" strokeWidth="1.6" fill="none" opacity="0.95">
          <path d="M142 132C165 103 169 106 188 92" />
          <path d="M188 92C212 96 222 109 238 116" />
          <path d="M238 116C260 96 262 86 274 78" />
          <path d="M238 116C265 127 287 130 310 128" />
          <path d="M210 156C240 139 269 128 310 128" />
          <path d="M310 128C330 112 346 105 365 112" />
          <path d="M310 128C318 148 326 158 332 166" />
          <path d="M188 92C204 123 209 141 210 156" />
        </g>
        {nodes.map(([x, y, label, fill]) => (
          <PreviewNode key={label} x={x} y={y} label={label} fill={fill} />
        ))}
        <circle cx="104" cy="142" r="8" fill="none" stroke="var(--preview-accent)" />
        <circle cx="407" cy="75" r="8" fill="none" stroke="var(--preview-accent)" />
      </FigureSvg>
    </LightPreview>
  )
}

function DashboardPreview({ accent }: { accent: SketchAccent }) {
  return (
    <LightPreview data-accent={accent}>
      <FigureSvg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
        <rect x="46" y="30" width="428" height="170" rx="7" fill="rgba(255,255,255,0.52)" stroke="rgba(56,48,36,0.22)" />
        {[82, 210, 338].map((x, index) => (
          <g key={x}>
            <rect x={x} y="62" width="90" height="52" rx="8" fill="rgba(255,255,255,0.38)" stroke="rgba(56,48,36,0.2)" />
            <text x={x + 18} y="93" fill="#2b2924" fontSize="12" fontWeight="600">
              {["Signal", "Cohort", "Progress"][index]}
            </text>
            <path
              d={`M${x + 12} 154C${x + 38} ${136 + index * 3} ${x + 62} ${164 - index * 4} ${x + 96} 144`}
              stroke={index === 1 ? "var(--preview-accent)" : "var(--preview-green)"}
              strokeWidth="2"
              fill="none"
            />
          </g>
        ))}
      </FigureSvg>
    </LightPreview>
  )
}

function MapPreview({ accent }: { accent: SketchAccent }) {
  return (
    <LightPreview data-accent={accent}>
      <FigureSvg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
        <rect x="44" y="28" width="432" height="174" rx="7" fill="rgba(255,255,255,0.48)" stroke="rgba(56,48,36,0.22)" />
        {Array.from({ length: 8 }).map((_, index) => (
          <path
            key={index}
            d={`M76 ${168 - index * 15}C142 ${110 - index * 7} 202 ${188 - index * 12} 264 ${128 - index * 9}C326 ${70 - index * 4} 382 ${116 - index * 8} 448 ${72 + index * 11}`}
            stroke="rgba(92, 112, 91, 0.28)"
            strokeWidth="1.2"
            fill="none"
          />
        ))}
        <path d="M98 160C150 134 184 122 232 104S317 68 414 56" stroke="var(--preview-accent)" strokeDasharray="7 9" strokeWidth="2" fill="none" />
        {[98, 232, 314, 414].map((x, index) => (
          <circle key={x} cx={x} cy={[160, 104, 78, 56][index]} r="7" fill="#faf8f3" stroke="var(--preview-accent)" strokeWidth="2" />
        ))}
      </FigureSvg>
    </LightPreview>
  )
}

function TimelinePreview({ accent }: { accent: SketchAccent }) {
  const items = ["Research", "Prototype", "Evaluate", "Ship"]

  return (
    <LightPreview data-accent={accent}>
      <FigureSvg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
        <rect x="46" y="30" width="428" height="170" rx="7" fill="rgba(255,255,255,0.48)" stroke="rgba(56,48,36,0.22)" />
        <path d="M88 122H432" stroke="rgba(56,48,36,0.2)" strokeWidth="2" />
        {items.map((item, index) => {
          const x = 96 + index * 110
          const raised = index % 2 === 0
          return (
            <g key={item}>
              <circle cx={x} cy="122" r="8" fill={index === 1 ? "var(--preview-accent)" : "var(--preview-green)"} />
              <rect x={x - 43} y={raised ? 70 : 146} width="86" height="30" rx="10" fill="var(--preview-node)" stroke="rgba(56,48,36,0.18)" />
              <text x={x} y={raised ? 89 : 165} textAnchor="middle" fill="#2b2924" fontSize="11">{item}</text>
            </g>
          )
        })}
      </FigureSvg>
    </LightPreview>
  )
}

function FieldNotePreview({ accent }: { accent: SketchAccent }) {
  return (
    <LightPreview data-accent={accent}>
      <FigureSvg viewBox="0 0 520 230" preserveAspectRatio="xMidYMid meet">
        <rect x="54" y="32" width="410" height="166" rx="7" fill="rgba(255,255,255,0.5)" stroke="rgba(56,48,36,0.22)" />
        {[72, 102, 132, 162].map((y, index) => (
          <path key={y} d={`M112 ${y}H${index === 3 ? 352 : 410}`} stroke="rgba(56,48,36,0.17)" strokeWidth="2" />
        ))}
        <circle cx="362" cy="72" r="7" fill="var(--preview-accent)" opacity="0.72" />
        <path d="M388 72H428" stroke="rgba(56,48,36,0.22)" strokeWidth="2" />
      </FigureSvg>
    </LightPreview>
  )
}

function PreviewPill({ x, y, label, fill }: { x: number; y: number; label: string; fill: string }) {
  return (
    <g>
      <rect x={x - 31} y={y - 14} width="62" height="28" rx="8" fill={fill} stroke="rgba(31,59,42,0.45)" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#20342a" fontSize="10" fontWeight="600">{label}</text>
    </g>
  )
}

function PreviewNode({ x, y, label, fill }: { x: number; y: number; label: string; fill: string }) {
  return (
    <g>
      <rect x={x - 18} y={y - 13} width="36" height="26" rx="12" fill={fill} stroke="rgba(31,59,42,0.45)" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#20342a" fontSize="10" fontWeight="600">{label}</text>
    </g>
  )
}

const CardLink = styled(Link)`
  display: block;
  height: 100%;
  color: inherit;
  text-decoration: none;
`

const CardArticle = styled.article`
  --cc-card-bg: #faf8f3;
  --cc-border: rgba(40, 34, 26, 0.14);
  --cc-divider: rgba(40, 34, 26, 0.12);
  --cc-ink: #24201c;
  --cc-ink-soft: rgba(36, 31, 26, 0.72);
  --cc-ink-muted: rgba(36, 31, 26, 0.56);
  --cc-preview-bg: #1f2722;
  --cc-preview-bg-2: #141a17;

  position: relative;
  display: flex;
  flex-direction: column;
  min-height: clamp(350px, 30vw, 405px);
  height: 100%;
  overflow: hidden;
  color: var(--cc-ink);
  background: var(--cc-card-bg);
  border: 1px solid var(--cc-border);
  border-radius: 7px;
  text-decoration: none;
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;

  &[data-has-link="true"]:hover,
  ${CardLink}:hover & {
    border-color: rgba(40, 34, 26, 0.26);
    box-shadow: 0 14px 34px -20px rgba(28, 28, 26, 0.35);
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Media = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2.25 / 1;
  flex-shrink: 0;
  overflow: hidden;
  border-bottom: 1px solid var(--cc-divider);
  background: linear-gradient(180deg, var(--cc-preview-bg) 0%, var(--cc-preview-bg-2) 100%);

  > div,
  > svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  @media (max-width: ${({ theme }) => theme.device.sm}) {
    aspect-ratio: 1.65 / 1;
  }
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: clamp(18px, 2vw, 22px) clamp(20px, 2.4vw, 24px) 22px;
`

const Eyebrow = styled.div`
  color: var(--cc-ink-muted);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
`

const Title = styled.h3`
  margin: 0;
  color: var(--cc-ink);
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 2.15vw, 2rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 0.98;
`

const Arrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgba(36, 31, 26, 0.85);
  transition: transform 0.35s ease;

  svg {
    width: 22px;
    height: 22px;
  }

  ${CardArticle}[data-has-link="true"]:hover &,
  ${CardLink}:hover & {
    transform: translateX(4px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

const Description = styled.p`
  max-width: 27rem;
  margin: 14px 0 0;
  color: var(--cc-ink-soft);
  font-size: clamp(0.9rem, 1.05vw, 0.98rem);
  font-weight: 500;
  line-height: 1.42;
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-top: auto;
  padding-top: 16px;
  color: var(--cc-ink-muted);
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1;
`

const Tag = styled.span`
  white-space: nowrap;
`

const Dot = styled.span`
  opacity: 0.5;
`

const FigureSvg = styled.svg`
  width: 100%;
  height: 100%;
`

const LightPreview = styled.div`
  --preview-accent: #8f5f3b;
  --preview-green: #52786d;
  --preview-blue: #6f8d98;
  --preview-node: #dbe7da;
  --preview-line: rgba(82, 120, 109, 0.48);

  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 20% 12%, rgba(255, 255, 255, 0.82), transparent 32%),
    linear-gradient(180deg, #f9f5eb 0%, #eee4d3 100%);

  &[data-accent="green"] {
    --preview-accent: #52786d;
  }

  &[data-accent="blue"] {
    --preview-accent: #6f8d98;
  }

  &[data-accent="slate"] {
    --preview-accent: #6d7371;
  }
`

const ModelPreview = styled.div`
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) minmax(126px, 26%);
  background: linear-gradient(180deg, #1f2722 0%, #141a17 100%);
`

const ModelRail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11px;
  padding: 10px 0;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.04);
`

const RailMark = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: #cdd5c1;
`

const RailIcon = styled.div`
  width: 13px;
  height: 13px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
`

const ModelGraph = styled.svg`
  align-self: center;
  width: 100%;
  height: 100%;
`

const ModelPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 14px;
  padding: 12px 14px;
  color: #1c1c1a;
  background: #f3ecdc;
  border-radius: 4px;
  box-shadow: 0 4px 20px -10px rgba(0, 0, 0, 0.4);
`

const PanelTitle = styled.div`
  color: inherit;
  font-size: 0.68rem;
  font-weight: 600;
`

const PanelSubcopy = styled.div`
  color: #6b665d;
  font-size: 0.56rem;
  line-height: 1.4;
`

const Sparkline = styled.svg`
  width: 100%;
  height: 36px;
  margin-top: auto;
`

const PanelAxes = styled.div`
  display: flex;
  justify-content: space-between;
  color: #6b665d;
  font-size: 0.44rem;
  letter-spacing: 0.05em;
`

const PathfinderShell = styled.div`
  display: grid;
  grid-template-columns: minmax(106px, 27%) minmax(0, 1fr) minmax(96px, 24%);
  color: #d6c48f;
  background: linear-gradient(180deg, #16221b 0%, #0e1612 100%);
`

const PathfinderList = styled.div`
  padding: 12px 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.5rem;
`

const ListHeader = styled.div`
  margin-bottom: 8px;
  color: rgba(214, 196, 143, 0.55);
  font-size: 0.44rem;
  letter-spacing: 0.16em;

  &[data-spaced="true"] {
    margin-top: 10px;
  }
`

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 0;
  opacity: 0.7;

  &[data-active="true"] {
    color: #f0c66a;
    opacity: 1;
  }
`

const ListBullet = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
`

const ListLine = styled.span`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(214, 196, 143, 0.18);
`

const PathfinderGraph = styled.svg`
  width: 100%;
  height: 100%;
`

const PathfinderPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 10px;
  padding: 9px;
  background: rgba(20, 28, 22, 0.85);
  border: 1px solid rgba(214, 196, 143, 0.18);
  border-radius: 4px;
`

const StepList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  color: rgba(214, 196, 143, 0.85);
  font-size: 0.5rem;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
  }
`

const StepDot = styled.span`
  width: 6px;
  height: 6px;
  border: 1px solid rgba(214, 196, 143, 0.5);
  border-radius: 50%;
`

const PreviewCta = styled.span`
  align-self: center;
  width: 72px;
  margin-top: auto;
  padding: 4px 8px;
  color: #1c1c1a;
  background: #d6c48f;
  border-radius: 999px;
  cursor: default;
  font-size: 0.5rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
`

export default SketchCard
