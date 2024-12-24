import { Monaco } from "@monaco-editor/react"
import { Id } from "../../convex/_generated/dataModel"

export interface Theme {
	id: string
	label: string
	color: string
}

export interface Language {
	id: string
	label: string
	logoPath: string
	monacoLanguage: string
	defaultCode: string
	pistonRuntime: LanguageRuntime
}

export interface LanguageRuntime {
	language: string
	version: string
}

export interface ExecuteCodeResponse {
	compile?: {
		output: string
	}
	run?: {
		output: string
		stderr: string
	}
}

export interface ExecutionResult {
	code: string
	output: string
	error: string | null
}

export interface CodeEditorState {
	language: string
	output: string
	isRunning: boolean
	error: string | null
	theme: string
	fontSize: number
	editor: Monaco | null
	executionResult: ExecutionResult | null

	setEditor: (editor: Monaco) => void
	getCode: () => string
	setLanguage: (language: string) => void
	setTheme: (theme: string) => void
	setFontSize: (fontSize: number) => void
	runCode: () => Promise<void>
}

export interface Snippet {
	_id: Id<"snippets">
	_creationTime: number
	userId: string
	language: string
	code: string
	title: string
	userName: string
}

export interface Comment {
	_id: Id<"snippetComments">
	_creationTime: number
	userId: string
	userName: string
	snippetId: Id<"snippets">
	content: string
}

export interface UserStats {
	totalExecutions: number
	languagesCount: number
	languages: string[]
	last24Hours: number
	favoriteLanguage: string
	languageStats: Record<string, number>
	mostStarredLanguage: string
}

export interface UserData {
	_id: Id<"users">
	_creationTime: number
	proSince?: number | undefined
	lemonSqueezyCustomerId?: string | undefined
	lemonSqueezyOrderId?: string | undefined
	userId: string
	email: string
	name: string
	isPro: boolean
}
