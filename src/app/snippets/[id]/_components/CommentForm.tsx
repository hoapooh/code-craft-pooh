import { useState } from "react"
import { Code, Send } from "lucide-react"
import CommentContent from "./CommentContent"

interface CommentFormProps {
	onSubmit: (content: string) => Promise<void> // INFO: This function is async
	isSubmitting: boolean
}

const CommentForm = ({ onSubmit, isSubmitting }: CommentFormProps) => {
	const [comment, setComment] = useState("")
	const [isPreview, setIsPreview] = useState(false)

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Tab") {
			event.preventDefault()
			let { selectionStart, selectionEnd } = event.currentTarget
			if (event.shiftKey) {
				// Handle Shift+Tab (unindent)
				const beforeSelection = comment.substring(0, selectionStart)
				const afterSelection = comment.substring(selectionEnd)

				// Check if there are spaces before cursor to remove
				if (beforeSelection.endsWith("  ")) {
					const newComment = beforeSelection.slice(0, -2) + afterSelection
					setComment(newComment)
					selectionStart = selectionEnd = selectionStart - 2
				}
			} else {
				// Normal Tab (indent)
				const newComment =
					comment.substring(0, selectionStart) + "  " + comment.substring(selectionEnd)
				setComment(newComment)
				selectionStart = selectionEnd = selectionStart + 2
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!comment.trim()) return

		await onSubmit(comment)
		setComment("")
		setIsPreview(false)
	}

	return (
		<form onSubmit={handleSubmit} className="mb-8">
			<div className="bg-[#0a0a0f] rounded-xl border border-[#ffffff0a] overflow-hidden">
				{/* ==== Form Header ==== */}
				<div className="flex justify-end gap-2 px-4 pt-2">
					<button
						type="button"
						onClick={() => setIsPreview(!isPreview)}
						className={`text-sm px-3 py-1 rounded-md transition-colors ${
							isPreview
								? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
								: "hover:bg-gray-500/20 text-gray-300"
						}`}
					>
						{isPreview ? "Edit" : "Preview"}
					</button>
				</div>

				{/* ==== Divider ==== */}
				<div className="border-b border-[#ffffff29] py-1"></div>

				{/* ==== Form Body ==== */}
				{isPreview ? (
					<div className="min-h-[120px] p-4 text-[#e1e1e3">
						<CommentContent content={comment} />
					</div>
				) : (
					<textarea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Add to the discussion..."
						className="w-full bg-transparent border-0 text-[#e1e1e3] placeholder:text-[#808086] outline-none 
            resize-none min-h-[120px] p-4 font-mono text-sm"
					/>
				)}

				{/* ==== Form Footer ==== */}
				<div className="flex items-center justify-between gap-4 px-4 py-3 bg-[#080809] border-t border-[#ffffff0a]">
					<div className="hidden sm:block text-xs text-[#808086] space-y-1">
						<div className="flex items-center gap-2">
							<Code className="size-3.5" />
							<span>Format code with ```language</span>
						</div>
						<div className="text-[#808086]/60 pl-5">
							Tab key inserts spaces • Preview your comment before posting
						</div>
					</div>
					<button
						type="submit"
						disabled={isSubmitting || !comment.trim()}
						className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-auto"
					>
						{isSubmitting ? (
							<>
								<div
									className="size-4 border-2 border-white/30 
                border-t-white rounded-full animate-spin"
								/>
								<span>Posting...</span>
							</>
						) : (
							<>
								<Send className="size-4" />
								<span>Comment</span>
							</>
						)}
					</button>
				</div>
			</div>
		</form>
	)
}

export default CommentForm
