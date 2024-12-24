import Link from "next/link"
import { Zap } from "lucide-react"

export default function UpgradeButton() {
	const CHEKOUT_URL =
		"https://code-craft-pooh.lemonsqueezy.com/buy/cbec936e-5800-4440-9dc6-dfdb46ac6b48"

	return (
		<Link
			href={CHEKOUT_URL}
			className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white 
        bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg 
        hover:from-blue-600 hover:to-blue-700 transition-all"
		>
			<Zap className="w-5 h-5" />
			Upgrade to Pro
		</Link>
	)
}
