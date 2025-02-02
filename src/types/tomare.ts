export type TomareState = {
    uid: string,
    menu: string,
    gappi: string,
    tomare: [],
    tomareId: string,
    am_pm: string
    make: boolean
    nail: boolean
    este: boolean
    sonota: string
    yoyakuId: string
    message: string
    timestamp: string
    yoyakuUid: string
    yoyakuIcon: string
    yoyakuMenu: string
    img_befor: string
    img_after: string
    come_befor: string
    come_after: string
    star: number
    chip: number
    checked: boolean
    tanka: number
    quantity: number
    pay: number
    payDay: string
    payReceipt: string
    receipt_url: string
    cusPay: number
    amount: number
    chipUrl: string
    paymentIntent: [
        {
            amount: number
            receipt_url: string
        }
    ]
}




