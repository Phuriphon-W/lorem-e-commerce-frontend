"use client"

import { wsAddr } from "@/shared/constants"
import useAppWebSocket from "@/shared/hooks/useAppWebSocket"
import { MessageType } from "@/shared/types/message"
import { message } from "antd"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SocketListener() {
    const router = useRouter()
    const pathName = usePathname()
    const { lastMessage } = useAppWebSocket(wsAddr)

    useEffect(() => {
        if (!lastMessage) return

        if (lastMessage.type === MessageType.PAYMENT_UPDATE) {
            if (lastMessage.status === "success") {
                message.success(`Payment successful! Order ${lastMessage.orderId?.split("-")[0]} is now processing`)
                if (pathName === "/order") {
                    router.refresh()
                }
            } else if (lastMessage.status === "failed") {
                message.error(`Payment failed. Please try again or use a different card.`);
                if (pathName === "/order") {
                    router.refresh()
                }
            }
        }
    }, [lastMessage, router])

    return null;
}