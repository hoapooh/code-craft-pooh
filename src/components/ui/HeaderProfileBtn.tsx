"use client"

import { LogOut, User } from "lucide-react"
import LoginButton from "@/components/ui/LoginButton"
import { ClerkLoaded, ClerkLoading, SignedOut, useClerk, UserButton } from "@clerk/nextjs"
import { useCodeEditorStore } from "@/store/useCodeEditorStore"

const HeaderProfileBtn = () => {
	const { signOut } = useClerk()
	const { setLanguage } = useCodeEditorStore()

	return (
		<>
			{/* ==== Loading state for Clerk ==== */}
			<ClerkLoading>
				<div className=" bg-[#1e1e2e]/80 rounded-full">
					<div className="flex items-center justify-center animate-pulse">
						<div className="w-7 h-7 rounded-full" />
					</div>
				</div>
			</ClerkLoading>

			{/* ==== Loaded state for Clerk ==== */}
			<ClerkLoaded>
				<UserButton
					appearance={{
						elements: {
							userButtonPopoverActionButton__signOut: "hidden", // INFO: Hide the default sign out button
						},
					}}
				>
					<UserButton.MenuItems>
						<UserButton.Link
							label="Profile"
							labelIcon={<User className="size-4" />}
							href="/profile"
						/>

						{/* THIS IS THE REPLACEMENT OF DEFAULT SIGNOUT BUTTON */}
						<UserButton.Action
							label="Sign out"
							labelIcon={<LogOut className="size-4" />}
							onClick={() => {
								signOut()
								setLanguage("javascript")
							}}
						/>
					</UserButton.MenuItems>
				</UserButton>

				<SignedOut>
					<LoginButton />
				</SignedOut>
			</ClerkLoaded>
		</>
	)
}

export default HeaderProfileBtn
