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

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
                  onClick={() => {
                    console.log("hello world");
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
