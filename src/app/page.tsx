"use client";

import { Button } from "@/components/ui/button";
import { exchangeLinearToken, getLinearAuthURL } from "@/utils/linear";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";

export default function Home() {
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
      console.log(access_token);
    })();
  }, []);

  return (
    <main>
      <Button variant="outline" onClick={openLinearAuth}>
        Open Linear Auth
      </Button>
    </main>
  );
}
