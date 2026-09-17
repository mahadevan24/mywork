import { Priority, SectionTopic, SubTask, TaskItem, WorkpadState } from "@/types/notes";

export function serializeWorkpadToNotepad(state: WorkpadState): string {
  const parts: string[] = [];

  // Top quick todos
  if (state.quickTodos && state.quickTodos.length > 0) {
    const quickLines = state.quickTodos.map((t) => {
      let line = t.title;
      if (t.completed) {
        line += " (done)";
      }
      if (t.priority === "urgent") {
        line += " ###########";
      } else if (t.priority === "high") {
        line += " !high";
      }
      return line;
    });
    parts.push(quickLines.join("\n"));
  }

  // Sections
  if (state.sections) {
    for (const sec of state.sections) {
      const secLines: string[] = [];
      secLines.push(`\n${sec.title}`);
      secLines.push("-".repeat(Math.max(sec.title.length + 4, 16)));

      if (sec.notes) {
        secLines.push(`// ${sec.notes}`);
      }

      for (const t of sec.tasks) {
        let taskPrefix = "- ";
        if (t.priority === "urgent") {
          taskPrefix = "## ";
        } else if (t.priority === "high") {
          taskPrefix = "!high - ";
        }

        let taskLine = `${taskPrefix}${t.title}`;
        if (t.completed) {
          taskLine += " (done)";
        }
        secLines.push(taskLine);

        if (t.subtasks && t.subtasks.length > 0) {
          for (const st of t.subtasks) {
            secLines.push(`   * ${st.title}${st.completed ? " (done)" : ""}`);
          }
        }
      }
      parts.push(secLines.join("\n"));
    }
  }

  return parts.join("\n\n");
}

export function parseNotepadToWorkpad(rawText: string): WorkpadState {
  const lines = rawText.split(/\r?\n/);
  const quickTodos: TaskItem[] = [];
  const sections: SectionTopic[] = [];

  let currentSection: SectionTopic | null = null;
  let currentTask: TaskItem | null = null;
  let inQuickSection = true;

  const sectionColorPalette = [
    "#3b82f6",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#14b8a6",
    "#f97316",
    "#6366f1",
  ];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      continue;
    }

    // Check if next line is a divider like "-----------" or "======="
    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
    const isNextDivider =
      nextLine.length >= 3 && (/^-+$/.test(nextLine) || /^=+$/.test(nextLine));

    // Or line starts with `# ` indicating a markdown section
    if (isNextDivider || (trimmed.startsWith("# ") && !trimmed.startsWith("## "))) {
      const sectionTitle = isNextDivider ? trimmed : trimmed.replace(/^#\s+/, "");
      inQuickSection = false;

      currentSection = {
        id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: sectionTitle,
        order: sections.length + 1,
        color: sectionColorPalette[sections.length % sectionColorPalette.length],
        tasks: [],
        createdAt: Date.now(),
      };
      sections.push(currentSection);
      currentTask = null;

      if (isNextDivider) {
        i++; // Skip divider line
      }
      continue;
    }

    // Check if this line is just a divider that was not caught
    if (/^-{3,}$/.test(trimmed) || /^={3,}$/.test(trimmed)) {
      continue;
    }

    // Parse task attributes: completion & priority
    let title = trimmed;
    let completed = false;
    let priority: Priority = "normal";

    if (/\(done\)/i.test(title)) {
      completed = true;
      title = title.replace(/\(done\)/gi, "").trim();
    }
    if (/^\[x\]/i.test(title)) {
      completed = true;
      title = title.replace(/^\[x\]/i, "").trim();
    }
    if (/^\[ \]/i.test(title)) {
      completed = false;
      title = title.replace(/^\[ \]/i, "").trim();
    }
    if (/#{3,}/.test(title) || /!urgent/i.test(title) || /\(urgent\)/i.test(title)) {
      priority = "urgent";
      title = title.replace(/#{3,}/g, "").replace(/!urgent/gi, "").replace(/\(urgent\)/gi, "").trim();
    }
    if (title.startsWith("## ")) {
      priority = "urgent";
      title = title.replace(/^##\s+/, "").trim();
    }
    if (/!high/i.test(title) || /\(high\)/i.test(title)) {
      priority = "high";
      title = title.replace(/!high/gi, "").replace(/\(high\)/gi, "").trim();
    }

    // Check if line is a subtask (starts with `* ` or indented with whitespace)
    const isIndented =
      rawLine.startsWith("  ") ||
      rawLine.startsWith("\t") ||
      trimmed.startsWith("* ");

    if (isIndented && currentTask) {
      const subTitle = trimmed.replace(/^[\*\-\+]\s+/, "");
      const subTask: SubTask = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: subTitle,
        completed,
      };
      if (!currentTask.subtasks) {
        currentTask.subtasks = [];
      }
      currentTask.subtasks.push(subTask);
      continue;
    }

    // Remove leading bullet if present
    const cleanTitle = title.replace(/^[\-\*\+]\s+/, "").trim();
    if (!cleanTitle) continue;

    // Detect tags (e.g., #api, #deploy)
    const tags: string[] = [];
    const tagMatches = cleanTitle.match(/#([a-zA-Z0-9_\-]+)/g);
    if (tagMatches) {
      tagMatches.forEach((t) => tags.push(t.replace("#", "").toLowerCase()));
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: cleanTitle,
      completed,
      priority,
      tags: tags.length > 0 ? tags : undefined,
      createdAt: Date.now(),
      completedAt: completed ? Date.now() : undefined,
    };

    if (inQuickSection || !currentSection) {
      quickTodos.push(newTask);
    } else {
      currentSection.tasks.push(newTask);
      currentTask = newTask;
    }
  }

  return {
    quickTodos,
    sections,
    lastUpdated: Date.now(),
  };
}
