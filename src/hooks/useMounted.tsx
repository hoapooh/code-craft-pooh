"use client"

import { useEffect, useState } from "react"

const useMounted = () => {
	const [mounted, setMounted] = useState(false)

	// INFO: use this to prevent flickering on initial render -- hydration error on client side
	useEffect(() => {
		setMounted(true)
	}, [])

	return mounted
}

export default useMounted
