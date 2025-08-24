import arcjet, {fixedWindow} from "@arcjet/next";

export const aj = arcjet({
    key:process.env.ARCJET_KEY,
    characteristics:["ip.src"],
    rules:[
        fixedWindow({
            mode:'LIVE',
            window:'60s',
            max:3,
        })
    ]
})