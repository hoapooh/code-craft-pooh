import { useState } from "react"
import toast from "react-hot-toast"
import { MessageSquare } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
import { SignInButton, useUser } from "@clerk/nextjs"
import { api } from "../../../../../convex/_generated/api"

import Comment from "./Comment"
import CommentForm from "./CommentForm"
import useGetSnippetId from "@/hooks/useGetSnippetId"
import { Id } from "../../../../../convex/_generated/dataModel"

const Comments = () => {
	const { user } = useUser()
	const snippetId = useGetSnippetId()

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)

	const addComment = useMutation(api.snippets.addComment)
	const deleteComment = useMutation(api.snippets.deleteComment)
	const comments = useQuery(api.snippets.getComments, { snippetId }) ?? []

	const handleSubmitComment = async (content: string) => {
		setIsSubmitting(true)

		try {
			await addComment({ snippetId, content })
			toast.success("Comment added successfully!")
		} catch (error) {
			toast.error("Something went wrong. Please try again.")
			console.log("Error adding comment", error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleDeleteComment = async (commentId: Id<"snippetComments">) => {
		setDeletingCommentId(commentId)

		try {
			await deleteComment({ commentId })
			toast.success("Comment deleted successfully!")
		} catch (error) {
			toast.error("Something went wrong. Please try again.")
			console.log("Error deleting comment", error)
		} finally {
			setDeletingCommentId(null)
		}
	}

	return (
		<div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
			{/* ==== Header ==== */}
			<div className="px-6 sm:px-8 py-6 pb-0 border-b border-[#ffffff0a]">
				<h2 className="text-lg font-semibold text-white flex items-center gap-2">
					<MessageSquare className="w-5 h-5" />
					Discussion ({comments.length})
				</h2>
			</div>

			{/* ==== Content ==== */}
			<div className="p-6 sm:p-8">
				{/* ==== Submit Form comment ==== */}
				{user ? (
					<CommentForm onSubmit={handleSubmitComment} isSubmitting={isSubmitting} />
				) : (
					<div className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]">
						<p className="text-[#808086] mb-4">Sign in to join the discussion</p>
						<SignInButton mode="modal">
							<button className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors">
								Sign In
							</button>
						</SignInButton>
					</div>
				)}

				{/* ==== List comments ==== */}
				<div className="space-y-6">
					{comments.map((comment) => (
						<Comment
							key={comment._id}
							comment={comment}
							onDelete={handleDeleteComment}
							isDeleting={deletingCommentId === comment._id}
							currentUserId={user?.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default Comments
