import { WorkpadState } from "@/types/notes";

export const INITIAL_DATA: WorkpadState = {
  lastUpdated: Date.now(),
  quickTodos: [
    {
      id: "quick-1",
      title: "Send screenshots",
      completed: true,
      priority: "normal",
      createdAt: Date.now() - 86400000 * 2,
      completedAt: Date.now() - 86400000,
    },
    {
      id: "quick-2",
      title: "Remove Satya mail id",
      completed: true,
      priority: "normal",
      createdAt: Date.now() - 86400000 * 2,
      completedAt: Date.now() - 86400000,
    },
    {
      id: "quick-3",
      title: "Stop dev oce mails",
      completed: false,
      priority: "normal",
      createdAt: Date.now() - 86400000,
    },
    {
      id: "quick-4",
      title: "Work on user analytics dashboard",
      completed: false,
      priority: "high",
      tags: ["dashboard", "analytics"],
      createdAt: Date.now() - 86400000,
    },
    {
      id: "quick-5",
      title: "BASTION request for these OEW urls",
      completed: false,
      priority: "high",
      tags: ["access", "bastion"],
      createdAt: Date.now() - 43200000,
    },
    {
      id: "quick-6",
      title: "check the AID doc for OEW urls",
      completed: false,
      priority: "normal",
      tags: ["docs"],
      createdAt: Date.now() - 43200000,
    },
    {
      id: "quick-7",
      title: "fix angular22 ui issues",
      completed: false,
      priority: "urgent",
      tags: ["frontend", "angular"],
      createdAt: Date.now() - 20000000,
    },
  ],
  sections: [
    {
      id: "sec-user-analytics",
      title: "User analytics dashboard",
      order: 1,
      color: "#3b82f6", // blue
      notes: "Focus area for the current sprint analytics deliverable.",
      createdAt: Date.now() - 86400000 * 3,
      tasks: [
        {
          id: "task-ua-1",
          title: "Focus on identifying the VP usage",
          completed: false,
          priority: "urgent",
          tags: ["milestone", "vp-usage"],
          createdAt: Date.now() - 86400000 * 2,
        },
        {
          id: "task-ua-2",
          title: "give the url to Parth, show what you have done so far.",
          completed: false,
          priority: "high",
          tags: ["sync", "demo"],
          createdAt: Date.now() - 86400000 * 2,
        },
        {
          id: "task-ua-3",
          title: "identify who is deploying ocedataservice tracker and which branch",
          completed: false,
          priority: "high",
          tags: ["pipeline", "tracker"],
          createdAt: Date.now() - 86400000,
          subtasks: [
            {
              id: "sub-ua-3-1",
              title:
                "open the nexxus pipeline, filter by your name, see when last you did run, check all the pipelines inbetween, check the params for which branch",
              completed: false,
            },
          ],
        },
        {
          id: "task-ua-4",
          title: "push your code into their branch",
          completed: false,
          priority: "normal",
          tags: ["git"],
          createdAt: Date.now() - 86400000,
        },
        {
          id: "task-ua-5",
          title:
            "check how db is connected in user analytics dashboard and update the values-dev.yaml, deploy it.",
          completed: false,
          priority: "high",
          tags: ["kubernetes", "config", "deploy"],
          createdAt: Date.now() - 43200000,
        },
      ],
    },
    {
      id: "sec-nexxus-dr",
      title: "Nexxus DR Testing",
      order: 2,
      color: "#f59e0b", // amber
      createdAt: Date.now() - 86400000 * 2,
      tasks: [
        {
          id: "task-dr-1",
          title: "test orderload API",
          completed: false,
          priority: "high",
          tags: ["testing", "api", "dr"],
          createdAt: Date.now() - 86400000,
          subtasks: [
            {
              id: "sub-dr-1-1",
              title: "formulate the DR env url for order load, get few payload to test it",
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: "sec-python-email",
      title: "Python Email Changes",
      order: 3,
      color: "#10b981", // emerald
      createdAt: Date.now() - 86400000 * 2,
      tasks: [
        {
          id: "task-py-1",
          title: "Remove the env column and related code changes",
          completed: true,
          priority: "normal",
          createdAt: Date.now() - 86400000,
          completedAt: Date.now() - 3600000,
        },
        {
          id: "task-py-2",
          title: "Remove the updated by column changes also",
          completed: true,
          priority: "normal",
          createdAt: Date.now() - 86400000,
          completedAt: Date.now() - 3600000,
        },
        {
          id: "task-py-3",
          title: "Merge changes to trunk",
          completed: false,
          priority: "urgent",
          tags: ["release", "trunk"],
          createdAt: Date.now() - 3600000,
        },
      ],
    },
    {
      id: "sec-angular-upgrade",
      title: "Angular 22 upgrade",
      order: 4,
      color: "#ef4444", // red
      createdAt: Date.now() - 86400000,
      tasks: [
        {
          id: "task-ng-1",
          title: "Audit breaking changes and package updates",
          completed: false,
          priority: "normal",
          tags: ["upgrade"],
          createdAt: Date.now() - 86400000,
        },
      ],
    },
    {
      id: "sec-mytracker-dr",
      title: "MyTracker DR",
      order: 5,
      color: "#8b5cf6", // purple
      createdAt: Date.now() - 86400000,
      tasks: [
        {
          id: "task-mt-1",
          title: "Trigger the pipeline in DR and see",
          completed: false,
          priority: "high",
          tags: ["ci-cd", "dr"],
          createdAt: Date.now() - 86400000,
        },
      ],
    },
    {
      id: "sec-saranya",
      title: "Saranya onboarding",
      order: 6,
      color: "#ec4899", // pink
      createdAt: Date.now() - 86400000,
      tasks: [
        {
          id: "task-so-1",
          title: "Prepare repo access, credentials & kickoff KT session",
          completed: false,
          priority: "normal",
          tags: ["onboarding"],
          createdAt: Date.now() - 86400000,
        },
      ],
    },
    {
      id: "sec-claude-cert",
      title: "Claude certification",
      order: 7,
      color: "#06b6d4", // cyan
      createdAt: Date.now() - 86400000,
      tasks: [
        {
          id: "task-cc-1",
          title: "Review certification roadmap and practice assessments",
          completed: false,
          priority: "normal",
          tags: ["learning", "cert"],
          createdAt: Date.now() - 86400000,
        },
      ],
    },
    {
      id: "sec-consulting-acad",
      title: "Consulting Academy",
      order: 8,
      color: "#14b8a6", // teal
      createdAt: Date.now() - 86400000,
      tasks: [
        {
          id: "task-ca-1",
          title: "Check pending modules and assignments",
          completed: false,
          priority: "normal",
          tags: ["training"],
          createdAt: Date.now() - 86400000,
        },
      ],
    },
    {
      id: "sec-vuln-fix",
      title: "Vulnerability fix",
      order: 9,
      color: "#e11d48", // rose
      createdAt: Date.now() - 86400000,
      tasks: [
        {
          id: "task-vf-1",
          title: "Scan CVE reports and patch high severity dependencies",
          completed: false,
          priority: "urgent",
          tags: ["security"],
          createdAt: Date.now() - 86400000,
        },
      ],
    },
  ],
};
