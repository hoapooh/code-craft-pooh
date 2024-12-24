import React from "react"

const SkeletonButton = () => {
	return (
		<div className="shadow rounded-lg w-48 h-[46px] min-h-[46px] px-4 bg-[#1e1e2e]/80">
			<div className="animate-pulse flex items-center w-full h-full gap-2">
				<div className="rounded-lg bg-slate-700 h-5 w-5" />
				<div className="flex-1 rounded bg-slate-700 h-3" />
				<div className="rounded-lg bg-slate-700 h-4 w-4" />
			</div>
		</div>
	)
}

export default SkeletonButton
