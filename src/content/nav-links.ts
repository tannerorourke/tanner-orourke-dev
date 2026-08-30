import type { IconName } from "@/components/icons/registry";

export type NavLink = {
  type: "section" | "link" | "link-cv";
  iconName?: IconName;
  text?: string;
  alt?: string;
  href?: string;
  tooltipText?: string;
  target?: string;
  download?: string;
  section?: boolean;
  // Opens a sidebar in place (no navigation); `href` is the no-JS fallback.
  drawer?: "work" | "contact";
};

export const LINKS: Record<string, NavLink> = {
  about: {
    type: "section",
    iconName: "user",
    text: "Hello", alt: "About",
    href: "/about",
    tooltipText: "About",
    section: true,
  },
  mywork: {
    type: "section",
    iconName: "code-brackets",
    text: "My Work", alt: "My Work",
    href: "/work",
    tooltipText: "My Work",
    section: true,
    drawer: "work",
  },
  contact: {
    type: "section",
    iconName: "envelope",
    text: "Reach out", alt: "Reach out",
    href: "/contact",
    tooltipText: "Reach out",
    section: true,
    drawer: "contact",
  },
  github: {
    type: "link",
    iconName: "github", 
    text: "GitHub", alt: "GitHub",
    href: "https://github.com/tannerorourke/",
    target: "_blank",
    tooltipText: "GitHub",
  },
  linkedin: {
    type: "link",
    iconName: "linkedin", 
    text: "LinkedIn", alt: "LinkedIn",
    href: "https://www.linkedin.com/in/tannerorourke/",
    target: "_blank",
    tooltipText: "LinkedIn"
  },
  email: {
    type: "link",
    iconName: "envelope", 
    text: "tannero@live.com", alt: "Email me",
    href: "mailto:tannero@live.com?subject=Reaching%20out",
    tooltipText: "Email me"
  },
  cv: {
    type: "link-cv",
    iconName: "file-text", 
    text: "CV (PDF)", alt: "Download CV",
    href: "/TannerORourke-Resume.pdf", target: "_blank",
    tooltipText: "Download CV"
  },
  repo: {
    type: "link",
    iconName: "code-brackets", 
    text: "GitHub Repo", alt: "View Source",
    href: "https://github.com/tannerorourke/vault",
    target: "_blank",
    tooltipText: "View Source"
  }
  // medium: {
  //   type: "link",
  //   iconName: "medium", alt: "Medium",
  //   href: "https://medium.com/@tannerorourke",
  //   target: "_blank",
  //   tooltipText: "Medium"
  // },
  // googlescholar: {
  //   type: "link",
  //   iconName: "googlescholar", alt: "Google Scholar",
  //   href: "https://scholar.google.com/citations?user=8d0bH4oAAAAJ&hl=en",
  //   target: "_blank",
  //   tooltipText: "Google Scholar"
  // }
}

export type SiteLinkKey = keyof typeof LINKS

export const CONTACT_LINKS: (SiteLinkKey)[] = 
  ["email", "linkedin", "github", "cv"];

export const NAV_LINKS: (SiteLinkKey)[] = 
  ["about", "mywork"];
