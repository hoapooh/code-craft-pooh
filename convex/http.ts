import { Webhook } from "svix"
import { api, internal } from "./_generated/api" // Ensure this import is correct and includes the users property
import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { WebhookEvent } from "@clerk/nextjs/server"

const http = httpRouter()

// CHECKPOINT: Webhook for Clerk
http.route({
	path: "/clerk-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
		if (!webhookSecret) {
			throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable")
		}

		const svix_id = request.headers.get("svix-id")
		const svix_signature = request.headers.get("svix-signature")
		const svix_timestamp = request.headers.get("svix-timestamp")

		if (!svix_id || !svix_signature || !svix_timestamp) {
			return new Response("Error occurred -- no svix headers", {
				status: 400,
			})
		}

		const payload = await request.json()
		const body = JSON.stringify(payload)

		const wh = new Webhook(webhookSecret)
		let evt: WebhookEvent

		try {
			evt = wh.verify(body, {
				"svix-id": svix_id,
				"svix-timestamp": svix_timestamp,
				"svix-signature": svix_signature,
			}) as WebhookEvent
		} catch (err) {
			console.error("Error verifying webhook:", err)
			return new Response("Error occurred", { status: 400 })
		}

		const eventType = evt.type
		if (eventType === "user.created") {
			// save the user to convex db
			const { id, email_addresses, first_name, last_name } = evt.data

			const email = email_addresses[0].email_address
			const name = `${first_name || ""} ${last_name || ""}`.trim()

			try {
				await ctx.runMutation(api.users.syncUser, {
					userId: id,
					email,
					name,
				})
			} catch (error) {
				console.log("Error creating user:", error)
				return new Response("Error creating user", { status: 500 })
			}
		}

		return new Response("Webhook processed successfully", { status: 200 })
	}),
})

// CHECKPOINT: Webhook for Lemon Squeezy
http.route({
	path: "/lemon-squeezy-webhook",
	method: "POST",
	handler: httpAction(async (ctx, req) => {
		const payloadString = await req.text()
		const signature = req.headers.get("X-Signature")

		if (!signature) {
			return new Response("Missing X-Signature header", {
				status: 400,
			})
		}

		// NOTE: internal function can only be called by other functions
		try {
			const payload = await ctx.runAction(internal.lemonSqueezy.verifyWebhook, {
				payload: payloadString,
				signature,
			})

			if (payload.meta.event_name === "order_created") {
				const { data } = payload

				const { success } = await ctx.runMutation(api.users.upgradeToPro, {
					lemonSqueezyCustomerId: data.attributes.customer_id.toString(),
					lemonSqueezyOrderId: data.id,
					email: data.attributes.user_email,
					amount: data.attributes.total,
				})

				if (success) {
					// optionally send an email ==> welcome to out platform
				}
			}

			return new Response("Webhook processed successfully", { status: 200 })
		} catch (error) {
			console.log("Webhook error: ", error)
			return new Response("Error processing webhook", { status: 500 })
		}
	}),
})

export default http
