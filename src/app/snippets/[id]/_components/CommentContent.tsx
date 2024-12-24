import CodeBlock from "./CodeBlock"

const CommentContent = ({ content }: { content: string }) => {
	// regex
	const parts = content.split(/(```[\w-]*\n[\s\S]*?\n```)/g)

	return (
		<div className="max-w-none text-white">
			{parts.map((part, index) => {
				if (part.startsWith("```")) {
					// ```javascript
					// const name = "John";
					// ```
					const match = part.match(/```([\w-]*)\n([\s\S]*?)\n```/)

					// match will be:
					/* [
						"```javascript\nconst name = "John";\n```",  // INFO: full match
						"javascript",                        				 // INFO: first capture group (language)
						"const name = "John";"               				 // INFO: second capture group (code)
					] */

					if (match) {
						const [, language, code] = match // INFO: skip the first one, language = javascript, code = 'const name = "John"';
						return <CodeBlock language={language} code={code} key={index} />
					}
				}

				return part.split("\n").map((line, lineIdx) => (
					<p key={lineIdx} className="mb-4 text-gray-300 last:mb-0">
						{line}
					</p>
				))
			})}
		</div>
	)
}

export default CommentContent
