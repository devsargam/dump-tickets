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

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
    })();
  }, []);

  useEffect(() => {
    if (accessToken) {
      console.log(accessToken);
    }
  }, [accessToken]);

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

  return (
    <main className="flex flex-col gap-4 items-center h-screen max-w-screen-md mx-auto py-10">
      <Button
        variant="outline"
        onClick={openLinearAuth}
        disabled={!!accessToken}
      >
        Open Linear Auth
      </Button>
      {accessToken && (
        <>
          <Textarea
            ref={textAreaRef}
            className="w-full h-full resize-none focus-visible:ring-0"
            rows={20}
            autoFocus
          />
          <Button
            variant="outline"
            onClick={async () => {
              const text = textAreaRef.current?.value;
              if (!text) return toast.error("No text to process");

              const response = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ text }),
              });

              const data = issuesSchema.safeParse(await response.json());
              if (!data.success) return toast.error("Failed to parse response");

              setIssues(data.data);
            }}
          >
            AI Actions
          </Button>

          {/* Render issues as cards when available */}
          {issues?.issues?.length ? (
            <section className="w-full flex flex-col gap-4 mt-8">
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
                    console.log("hello world");

                    createIssue(issues);
                  }}
                >
                  Import to Linear
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
                  />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
