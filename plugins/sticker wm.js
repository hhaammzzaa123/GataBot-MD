import { addExif } from '../lib/sticker.js'
let handler = async (m, { conn, text }) => {
if (!m.quoted) throw 'الرجاء الاشارة الى الملصق الذي تريد أن تغير حقوقه مثال : \n *.wm 𝐌𝐑•𝐇𝐀𝐌𝐙𝐀*'
let stiker = false
try {
let [packname, ...author] = text.split('|')
author = (author || []).join('|')
let mime = m.quoted.mimetype || ''
if (!/webp/.test(mime)) throw '*الرجاء الاشارة الى الملصق الذي تريد أن تغير حقوقه مثال : \n *.wm noureddine ouafy*'
let img = await m.quoted.download()
if (!img) throw '*الرجاء  الاشارة الى الملصق الذي تريد أن تغير حقوقه مثال : \n *.wm 𝐌𝐑•𝐇𝐀𝐌𝐙𝐀*'
stiker = await addExif(img, packname || global.packname, author || global.author)
} catch (e) {
console.error(e)
if (Buffer.isBuffer(e)) stiker = e
} finally {
if (stiker) conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, { asSticker: true })
else throw '*راسل صاحب البوت هناك مشكلة\n instagram.com/a_h_l_y1*'
}}
handler.help = ['wm']
handler.tags = ['sticker']
handler.command = /^take|wm$/i
export default handler
