import type { ComponentType } from "react";
import type { IconProps } from "@/lib/types/icons";

/** Unused icons explicitly kept in case we need them but keep bundle small
 *  Always use duotone icons from https://icon-sets.iconify.design/ph/ when possible
*/

// import { ArrowCircleDown } from "./arrow-circle-down";
// import { ArrowCircleUp } from "./arrow-circle-up";
import { ArrowDown } from "./arrow-down";
import { ArrowLeft } from "./arrow-left";
// import { ArrowRight } from "./arrow-right";
import { ArrowUp } from "./arrow-up";
import { ArrowUpRight } from "./arrow-up-right";
import { CaretCircleDown } from "./caret-circle-down";
// import { CaretDown } from "./caret-down";
// import { CaretUp } from "./caret-up";
// import { CaretLeft } from "./caret-left";
// import { CaretRight } from "./caret-right";
import { CodeBrackets } from "./code-brackets";
import { Coffee } from "./coffee";
import { Colab } from "./colab";
// import { CodeFile } from "./code-file";
// import { Download } from "./download";
import { Envelope } from "./envelope";
import { FileText } from "./file-text";
import { Github } from "./github";
// import { GradCap } from "./grad-cap";
// import { Heart } from "./heart";
import { Linkedin } from "./linkedin";
import { List } from "./list";
import { ListBullets } from "./list-bullets";
// import { Medium } from "./medium";
import { Moon } from "./moon";
// import { Network } from "./network";
// import { Notebook } from "./notebook";
import { Pdf } from "./pdf";
import { Sun } from "./sun";
import { Times } from "./times";
import { User } from "./user";

export const iconRegistry = {
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-up": ArrowUp,
  "arrow-up-right": ArrowUpRight,
  "caret-circle-down": CaretCircleDown,
  "code-brackets": CodeBrackets,
  "coffee": Coffee,
  "colab": Colab,
  "envelope": Envelope,
  "file-text": FileText,
  "github": Github,
  "linkedin": Linkedin,
  "list": List,
  "list-bullets": ListBullets,
  "moon": Moon,
  "pdf": Pdf,
  "sun": Sun,
  "times": Times,
  'user': User
} as const satisfies Record<string, ComponentType<IconProps>>;

export type IconName = keyof typeof iconRegistry;
