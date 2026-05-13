import fs from "fs";
import path from "path";

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      
      // Backgrounds
      content = content.replace(/bg-\[#0a0a0a\]/g, "bg-bg-primary");
      content = content.replace(/bg-\[#111111\]/g, "bg-surface-primary");
      content = content.replace(/bg-\[#161618\]/g, "bg-bg-secondary");
      content = content.replace(/bg-\[#0e0e0e\]/g, "bg-bg-secondary");
      content = content.replace(/bg-zinc-950\/20/g, "bg-surface-primary/20");
      content = content.replace(/bg-zinc-950/g, "bg-bg-secondary");
      content = content.replace(/bg-zinc-900\/(\d+)/g, "bg-surface-primary/$1");
      content = content.replace(/bg-zinc-900/g, "bg-surface-primary");
      content = content.replace(/bg-zinc-800\/(\d+)/g, "bg-surface-hover/$1");
      content = content.replace(/bg-zinc-800/g, "bg-surface-hover");
      content = content.replace(/bg-zinc-100/g, "bg-white");
      
      // Borders
      content = content.replace(/border-zinc-800\/(\d+)/g, "border-border-subtle/$1");
      content = content.replace(/border-zinc-800/g, "border-border-subtle");
      content = content.replace(/border-zinc-700/g, "border-border-strong");
      content = content.replace(/border-zinc-900/g, "border-bg-primary");
      
      // Text
      content = content.replace(/text-zinc-100/g, "text-text-primary");
      content = content.replace(/text-zinc-200/g, "text-text-primary");
      content = content.replace(/text-zinc-300/g, "text-text-primary");
      content = content.replace(/text-zinc-400/g, "text-text-secondary");
      content = content.replace(/text-zinc-500/g, "text-text-secondary");
      content = content.replace(/text-zinc-600/g, "text-text-muted");
      content = content.replace(/text-zinc-700/g, "text-border-strong");
      
      // Structural classes
      content = content.replace(/glass-panel/g, "glass-panel"); // handled in css
      content = content.replace(/builder-accent/g, "builder-accent");

      fs.writeFileSync(fullPath, content, "utf8");
    }
  }
}

processDirectory("./src");
console.log("Done text replacements.");
