"use client"

import Image from "next/image"
import { useQuery } from "convex/react"
import { Editor } from "@monaco-editor/react"
import { api } from "../../../../convex/_generated/api"
import { Clock, Code, MessageSquare, Undo2, User } from "lucide-react"
import { defineMonacoThemes, LANGUAGE_CONFIG } from "@/app/(root)/_constants"

import { motion } from "framer-motion"
import CopyButton from "./_components/CopyButton"
import useGetSnippetId from "@/hooks/useGetSnippetId"
import NavigationHeader from "@/components/ui/NavigationHeader"
import SkeletonSnippetLoading from "@/components/ui/SkeletonSnippetLoading"
import { useRouter } from "next/navigation"
import Comments from "./_components/Comments"

const SnippetDetailPage = () => {
	const snippetId = useGetSnippetId()
	const router = useRouter()

	const comments = useQuery(api.snippets.getComments, { snippetId })
	const snippet = useQuery(api.snippets.getSnippetById, { snippetId })

	if (snippet === undefined) return <SkeletonSnippetLoading />

	return (
		<div className="min-h-screen bg-[#0a0a0f]">
			<NavigationHeader />

			<main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				<div className="max-w-[1200px] mx-auto space-y-6">
					{/* ==== Return button ==== */}
					<div className="flex items-center justify-end">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => router.back()}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
	               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
						>
							<Undo2 className="size-4 text-white" />
							<span className="text-sm font-medium text-white">Return</span>
						</motion.button>
					</div>

					{/* ==== Header ==== */}
					<div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
							<div className="flex items-center gap-4">
								<div className="flex items-center justify-center size-12 rounded-xl bg-[#ffffff08] p-2.5 shrink-0">
									<Image
										src={`/${snippet.language}.png`}
										alt={`${snippet.language} logo`}
										width={24}
										height={24}
										className="w-full h-full object-contain"
									/>
								</div>

								<div>
									<h1 className="text-xl sm:text-2xl font-semibold text-white mb-2">
										{snippet.title}
									</h1>
									<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
										<div className="flex items-center gap-2 text-[#8b8b8d]">
											<User className="size-4" />
											<span>{snippet.userName}</span>
										</div>
										<div className="flex items-center gap-2 text-[#8b8b8d]">
											<Clock className="size-4" />
											<span>{new Date(snippet._creationTime).toLocaleDateString()}</span>
										</div>
										<div className="flex items-center gap-2 text-[#8b8b8d]">
											<MessageSquare className="size-4" />
											<span>{comments?.length} comments</span>
										</div>
									</div>
								</div>
							</div>

							<div className="inline-flex w-full sm:w-auto items-center justify-center px-3 py-1.5 bg-[#ffffff08] text-[#808086] rounded-lg text-sm font-medium">
								{snippet.language}
							</div>
						</div>
					</div>

					{/* ==== Code editor ==== */}
					<div className="rounded-2xl overflow-hidden border border-[#ffffff0a] bg-[#121218]">
						<div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#ffffff0a]">
							<div className="flex items-center gap-2 text-[#808086]">
								<Code className="size-4" />
								<span className="text-sm font-medium">Source Code</span>
							</div>
							<CopyButton code={snippet.code} />
						</div>
						<Editor
							height="600px"
							language={LANGUAGE_CONFIG[snippet.language].monacoLanguage}
							value={snippet.code} // INFO: assign the code to the editor
							theme="vs-dark"
							beforeMount={defineMonacoThemes}
							options={{
								minimap: { enabled: false },
								fontSize: 16,
								readOnly: true,
								automaticLayout: true,
								scrollBeyondLastLine: false,
								padding: { top: 16 },
								renderWhitespace: "selection",
								fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
								fontLigatures: true,
							}}
						/>
					</div>

					{/* ==== Comments ==== */}
					<Comments />
				</div>
			</main>
		</div>
	)
}

export default SnippetDetailPage
