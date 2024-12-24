import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	// NOTE: With the use of index, we want to get user by userId so we need to pass the userId to the query
	users: defineTable({
		userId: v.string(), // INFO: This is actually a Clerk ID so it is a string
		email: v.string(),
		name: v.string(),
		isPro: v.boolean(),

		// INFO: these can be optional (which can be null if user is not a Pro)
		proSince: v.optional(v.number()),
		lemonSqueezyCustomerId: v.optional(v.string()),
		lemonSqueezyOrderId: v.optional(v.string()),
	}).index("by_user_id", ["userId"]),

	codeExecutions: defineTable({
		userId: v.string(), // INFO: This is actually a Clerk ID so it is a string
		language: v.string(),
		code: v.string(),
		output: v.optional(v.string()),
		error: v.optional(v.string()),
	}).index("by_user_id", ["userId"]),

	snippets: defineTable({
		userId: v.string(), // INFO: This is actually a Clerk ID so it is a string
		title: v.string(),
		language: v.string(),
		code: v.string(),
		userName: v.string(), // INFO: Store user's name for easy access
	}).index("by_user_id", ["userId"]),

	snippetComments: defineTable({
		snippetId: v.id("snippets"),
		userId: v.string(), // INFO: This is actually a Clerk ID so it is a string
		userName: v.string(),
		content: v.string(), // INFO: This will store HTML content
	}).index("by_snippet_id", ["snippetId"]),

	stars: defineTable({
		userId: v.string(), // INFO: This is actually a Clerk ID so it is a string
		snippetId: v.id("snippets"),
	})
		.index("by_user_id", ["userId"]) // INFO: get all snippets starred by a user
		.index("by_snippet_id", ["snippetId"]) // INFO: get all users who starred a snippet
		.index("by_user_id_and_snippet_id", ["userId", "snippetId"]), // INFO: check if a user starred a snippet
})
