export type OrderCheckoutRequest = {
    orderId: string,
    userId: string,
}

export type OrderCheckoutResponse = {
    checkoutUrl: string,
}