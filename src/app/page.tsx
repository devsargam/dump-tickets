"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IssueCard } from "@/components/linear-issue-card";
import { clearURLParams } from "@/utils";
import { exchangeLinearToken, getLinearAuthURL } from "@/utils/linear";
import { type Issue, issuesSchema } from "@/utils/zod";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { LINEAR } from "@/utils/constants";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

// Step labels for the multi-step flow
const STEPS = ["Auth", "Prepare", "Import"] as const;

interface ProgressBarProps {
  step: number;
}

// Visual progress bar shown at the top of the page
function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div className="w-full flex items-center justify-between mb-8 max-w-sm">
      {STEPS.map((label, idx) => (
        <div key={label} className="flex flex-col items-center flex-1">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
              idx <= step
                ? "bg-primary text-primary-foreground"
                : "border border-muted-foreground text-muted-foreground"
            }`}
          >
            {idx + 1}
          </div>
          <span className="mt-2 text-xs sm:text-sm text-center whitespace-nowrap">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isCreatingTicketsWithAI, setIsCreatingTicketsWithAI] = useState(false);
  const [isCreatingLinearTickets, setIsCreatingLinearTickets] = useState(false);

  const createIssue = async (issues: Issue) => {
    if (!accessToken) {
      toast.error(
        "Missing access token. Please authenticate with Linear first."
      );
      return;
    }

    try {
      // Step 1: Fetch the first available team for the authenticated user.
      const viewerQuery = `
        query ViewerTeams {
          viewer {
            teams(first: 1) {
              nodes {
                id
                name
              }
            }
          }
        }
      `;

      const viewerRes = await fetch(LINEAR.GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query: viewerQuery }),
      });

      const viewerData = await viewerRes.json();
      const teamId = viewerData?.data?.viewer?.teams?.nodes?.[0]?.id as
        | string
        | undefined;

      if (!teamId) {
        toast.error("Unable to resolve a Linear team for this account.");
        return;
      }

      // Helper GraphQL mutation string (re-used for each issue)
      const issueCreateMutation = `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue {
              id
              identifier
              title
            }
          }
        }
      `;

      const totalIssues = issues.issues.length;
      let completedIssues = 0;

      for (const { title, description } of issues.issues) {
        // Create a promise that performs the mutation
        const mutationPromise = (async () => {
          const variables = {
            input: {
              teamId,
              title,
              description,
            },
          };

          const createRes = await fetch(LINEAR.GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ query: issueCreateMutation, variables }),
          });

          const createData = await createRes.json();

          if (!createData?.data?.issueCreate?.success) {
            throw new Error(`Failed to create issue: ${title}`);
          }

          return createData.data.issueCreate.issue;
        })();

        // Fire and forget the toast; it doesn't return the mutation promise
        toast.promise(mutationPromise, {
          // loading: `Creating "${title}" (${
          //   completedIssues + 1
          // }/${totalIssues})...`,
          loading: "Creating issue...",
          success: (issue: { identifier: string }) => {
            completedIssues += 1;
            return `Created ${issue.identifier}: ${title}`;
          },
          error: (err: Error) => err.message,
        });

        // Wait for the mutation itself before continuing
        await mutationPromise;
      }

      setIsCreatingLinearTickets(false);
      toast.success(
        `All ${totalIssues} issues have been imported to Linear 🚀`
      );
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred while creating issues.");
    }
  };

  const openLinearAuth = () => {
    // Generate random code to validate against CSRF attack
    const verificationCode = `linear-${uuid()}`;
    localStorage.setItem("linear-verification", verificationCode);

    const authURL = getLinearAuthURL(verificationCode);
    window.location.replace(authURL);
  };

  // Handle Linear auth response
  useEffect(() => {
    (async () => {
      const authResponse = new URLSearchParams(window.location.search);
      if (!authResponse.has("code")) return;

      const verificationCode = localStorage.getItem("linear-verification");
      if (!authResponse.get("state")?.includes("linear")) return;
      if (authResponse.get("state") !== verificationCode) {
        alert("Linear auth returned an invalid code. Please try again.");
        return;
      }
      const refreshToken = authResponse.get("code");

      const { access_token } = await exchangeLinearToken(refreshToken!);
      if (!access_token) return toast.error("Failed to exchange token");

      setAccessToken(access_token);
      clearURLParams();
      // Move to the next step after successful authentication
      setCurrentStep(1);
    })();
  }, []);

  // Automatically move to the "Import" step once issues are available
  useEffect(() => {
    if (issues?.issues?.length) {
      setCurrentStep(2);
    }
  }, [issues]);

  // Function to remove an issue by index
  function removeIssue(index: number) {
    setIssues((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        issues: prev.issues.filter((_, idx) => idx !== index),
      };
    });
  }

  function editIssue(index: number, title: string, description: string) {
    setIssues((prev) => {
      if (!prev) return prev;
      const updatedIssues = [...prev.issues];
      updatedIssues[index] = { title, description };
      return {
        ...prev,
        issues: updatedIssues,
      };
    });
  }

  return (
    <main className="flex flex-col items-center h-screen max-w-screen-md mx-auto py-10 px-4">
      {/* Progress indicator */}
      <ProgressBar step={currentStep} />

      {/* Hero header */}

      {/* Step 1 – Authentication */}
      {currentStep === 0 && (
        <section className="flex flex-col items-center gap-6">
          <header className="text-center mb-10 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Import issues to Linear in seconds
            </h1>
            <p className="mt-3 text-muted-foreground">
              Connect your account, paste a list of tasks, and let our AI turn
              them into ready-to-track Linear issues.
            </p>
          </header>
          <Button
            size="lg"
            className="px-8"
            variant="default"
            onClick={openLinearAuth}
            disabled={!!accessToken}
          >
            Connect Linear Account
          </Button>
          <p className="text-sm text-muted-foreground max-w-sm text-center">
            We'll redirect you to Linear to securely authorise access. You can
            revoke permissions at any time.
          </p>
        </section>
      )}

      {/* Step 2 – Prepare issues */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-4 w-full">
          <Textarea
            ref={textAreaRef}
            className="w-full h-full min-h-[500px] resize-none focus-visible:ring-0"
            rows={18}
            autoFocus
          />
          <Button
            variant="default"
            onClick={async () => {
              const text = textAreaRef.current?.value;
              if (!text) return toast.error("No text to process");

              setIsCreatingTicketsWithAI(true);
              const response = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ text }),
              });

              const data = issuesSchema.safeParse(await response.json());
              if (!data.success) return toast.error("Failed to parse response");

              setIsCreatingTicketsWithAI(false);
              setIssues(data.data);
            }}
          >
            Create Issues
            {isCreatingTicketsWithAI && (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            )}
          </Button>
        </div>
      )}

      {/* Step 3 – Import to Linear */}
      {currentStep === 2 && issues?.issues?.length ? (
        <section className="w-full flex flex-col gap-4">
          <header className="flex items-center justify-between gap-2 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <h2>Todo</h2>
              <span className="text-muted-foreground">
                {issues.issues.length}
              </span>
            </div>
            <Button
              variant="default"
              onClick={async () => {
                setIsCreatingLinearTickets(true);
                createIssue(issues);
              }}
            >
              Import to Linear
              {isCreatingLinearTickets && (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              )}
            </Button>
          </header>

          <div className="flex flex-col gap-3">
            {issues.issues.map(({ title, description }, idx) => (
              <IssueCard
                key={idx}
                index={idx + 1}
                title={title}
                description={description}
                onDelete={() => removeIssue(idx)}
                onEdit={(newTitle, newDescription) => editIssue(idx, newTitle, newDescription)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Toasts */}
      <Toaster />
    </main>
  );
}
