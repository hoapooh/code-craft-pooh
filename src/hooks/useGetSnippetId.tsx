import { useParams } from "next/navigation"
import { Id } from "../../convex/_generated/dataModel"

const useGetSnippetId = () => {
	const { id } = useParams<{ id: Id<"snippets"> }>()

	return id
}

export default useGetSnippetId
