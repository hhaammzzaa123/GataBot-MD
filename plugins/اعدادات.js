const handler = async (m, { conn, isAdmin, isOwner, args, usedPrefix, command }) => {

  // التحقق من أن المستخدم هو مشرف أو مالك الجروب

  if (!(isAdmin || isOwner)) {

    global.dfail('admin', m, conn);

    throw false;

  }

  // تحديد حالة الجروب إما "فتح" أو "قفل"

  const groupState = {

    'فتح': 'not_announcement',  // فتح الجروب للجميع

    'قفل': 'announcement',      // قفل الجروب ليصبح للمشرفين فقط

  }[(args[0] || '').toLowerCase()];

  if (groupState === undefined) {

    const message = `

*• أوامر التحكم في الجروب:*

*${usedPrefix + command} فتح* - لفتح الجروب

*${usedPrefix + command} قفل* - لقفل الجروب

📌 استخدم هذه الأوامر للتحكم في من يمكنه إرسال الرسائل.

`;

    m.reply(message);

    throw false;

  }

  // حساب الوقت المحدد لتنفيذ الفتح أو القفل

  const timeDelay = (args[1] ? parseInt(args[1]) : 0) * 60000; // تحويل الوقت إلى ملي ثانية

  // تحديث إعدادات الجروب (فتح أو قفل)

  await conn.groupSettingUpdate(m.chat, groupState).then(async () => {

    m.reply(`تم ${groupState === 'announcement' ? 'قفل' : 'فتح'} الجروب بنجاح!${timeDelay ? ` سيتم التغيير مرة أخرى بعد ${clockString(timeDelay)}.` : ''}`);

  });

  // إذا تم تحديد وقت، قم بإعادة فتح أو قفل الجروب بعد انتهاء الوقت المحدد

  if (timeDelay > 0) {

    setTimeout(async () => {

      const newState = groupState === 'announcement' ? 'not_announcement' : 'announcement';

      await conn.groupSettingUpdate(m.chat, newState).then(async () => {

        m.reply(`تم ${newState === 'announcement' ? 'قفل' : 'فتح'} الجروب بعد انتهاء الفترة المحددة.`);

      });

    }, timeDelay);

  }

};

// إعدادات الأوامر

handler.help = ['اعدادات <فتح/قفل> [المدة بالدقائق]'];

handler.tags = ['group'];

handler.command = /^(اعدادات)$/i;

handler.botAdmin = true;

handler.group = true;

export default handler;

// وظيفة لتحويل الوقت من ملي ثانية إلى صيغة الوقت (ساعة:دقيقة:ثانية)

function clockString(ms) {

  const h = Math.floor(ms / 3600000);

  const m = Math.floor((ms % 3600000) / 60000);

  const s = Math.floor((ms % 60000) / 1000);

  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');

}