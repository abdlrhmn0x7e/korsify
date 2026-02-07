import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { authComponent, createAuth } from "./auth";
import { createStudentAuth, studentAuthComponent } from "./studentAuth";

async function computeHMAC(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);
studentAuthComponent.registerRoutes(http, createStudentAuth);

// ============================================
// Mux Webhook Handler
// ============================================
http.route({
  path: "/mux-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // TODO: Add webhook signature verification for production
    // https://docs.mux.com/guides/listen-for-webhooks#verify-webhook-signatures

    const body = await request.json();
    const eventType = body.type as string;
    const data = body.data;

    switch (eventType) {
      case "video.upload.asset_created": {
        // Upload completed, asset is being created
        const uploadId = data.id as string;
        const assetId = data.asset_id as string;

        await ctx.runMutation(internal.mux.internal.onUploadAssetCreated, {
          uploadId,
          assetId,
        });
        break;
      }

      case "video.asset.ready": {
        // Video is ready to play
        const assetId = data.id as string;
        const playbackId = data.playback_ids?.[0]?.id as string | undefined;
        const duration = data.duration as number | undefined;
        const aspectRatio = data.aspect_ratio as string | undefined;

        if (playbackId) {
          await ctx.runMutation(internal.mux.internal.onAssetReady, {
            assetId,
            playbackId,
            duration,
            aspectRatio,
          });
        }
        break;
      }

      case "video.asset.errored": {
        // Video processing failed
        const assetId = data.id as string;
        const errors = data.errors as { type: string; message: string }[];
        const errorMessage = errors?.[0]?.message;

        await ctx.runMutation(internal.mux.internal.onAssetErrored, {
          assetId,
          errorMessage,
        });
        break;
      }
    }

    return new Response("OK", { status: 200 });
  }),
});

// ============================================
// Paymob Subscription Webhook Handler
// ============================================
http.route({
  path: "/paymob-subscription-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payload = await request.json();
    console.log("Paymob subscription webhook payload:", payload);
    const hmacSecret = process.env.PAYMOB_HMAC!;

    // Verify HMAC: computed over the JSON-stringified subscription_data
    const subscriptionData = payload.subscription_data;
    if (!subscriptionData) {
      console.error("Missing subscription_data in webhook payload");
      return new Response("Invalid payload", { status: 400 });
    }

    const computed = await computeHMAC(
      `${payload.trigger_type}for${payload.subscription_data.id}`,
      hmacSecret
    );

    if (computed !== payload.hmac) {
      console.error("Invalid HMAC signature for Paymob subscription webhook");
      return new Response("Invalid signature", { status: 401 });
    }

    await ctx.runAction(internal.paymob.internal.fulfillSubscription, {
      payload,
    });

    return new Response("OK", { status: 200 });
  }),
});

export default http;
