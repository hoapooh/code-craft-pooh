import toast from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"
import { BadgeInfo, Star } from "lucide-react"
import { api } from "../../convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { Id } from "../../convex/_generated/dataModel"

function StarButton({ snippetId }: { snippetId: Id<"snippets"> }) {
	const { isSignedIn } = useAuth()

	const star = useMutation(api.snippets.starSnippet)
	const isStarred = useQuery(api.snippets.isSnippetStarred, { snippetId })
	const starCount = useQuery(api.snippets.getSnippetStarCount, { snippetId })

	const handleStar = async () => {
		if (!isSignedIn) {
			toast("You need to sign in to star a snippet", {
				icon: <BadgeInfo className="text-blue-500 size-6" />,
			})
			return
		}
		await star({ snippetId })
	}

	return (
		<button
			className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
    transition-all duration-200 ${
			isStarred
				? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
				: "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
		}`}
			onClick={handleStar}
		>
			<Star
				className={`size-4 ${isStarred ? "fill-yellow-500" : "fill-none group-hover:fill-gray-400"}`}
			/>
			<span className={`text-xs font-medium ${isStarred ? "text-yellow-500" : "text-gray-400"}`}>
				{starCount}
			</span>
		</button>
	)
}

export default StarButton
