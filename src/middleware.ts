import { OAuthStrategy, createClient } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const cookies = request.cookies;
  const res = NextResponse.next();

  if (cookies.get("refreshToken")) {
    return res;
  }

  const wixClient = createClient({
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
  });

  try {
    const tokens = await wixClient.auth.generateVisitorTokens();
    console.log("Generated tokens:", tokens); // Log the tokens for debugging
    res.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
      maxAge: 60 * 60 * 24 * 30,
    });
  } catch (error) {
    console.error("Error generating visitor tokens:", error);
    // Handle the error (optional: return an error response)
    // You might return a custom error response or handle it according to your application logic
  }

  return res;
};
