import { PrismaClient } from "@prisma/client";
// import { Permission } from "../src/server/auth";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

/**
 * Admin emails.
 * Users with these emails will be granted all permissions.
 *
 * @type {string[]}
 */
const ADMIN_EMAILS = ["fcuhackersir@mail.fcu.edu.tw"];

/**
 * Here are some necessary settings for the website.
 *
 * @type {import("@prisma/client").Prisma.SettingCreateInput[]}
 */
const SETTINGS = [
  {
    id: "applicable",
    value: "true",
    description: "是否可以申請入社",
  },
  {
    id: "current_year",
    value: "2023",
    description: "當前年度, 等同於社員入社的年度",
  },
  {
    id: "member_vaild_until",
    value: "2024-07-31T23:59:59+08:00",
    description: "社員有效期限",
  },
  {
    id: "club_fee",
    value: "400",
    description: "社費",
  },
];

/**
 * Welcome party event.
 * The event's id should always be "welcome-party".
 *
 * @type {import("@prisma/client").Prisma.EventCreateInput}
 */
const WELCOME_PARTY = {
  id: "welcome-party", // do not modify this
  name: "黑客社新生茶會 🎉",
  description:
    "茶會上會公布本學期的課程內容/活動規劃與時間\n對社團有任何疑問也可以在茶會上一次問個夠\n歡迎所有人來參加喔~ (≧▽≦)",
  type: "活動",
  venue: "逢甲大學 資訊電機館 B22",
  links: "https://hackersir.kktix.cc/events/20220915for-beginners",
  startAt: new Date("2023-09-15T19:00:00+08:00"),
  endAt: new Date("2023-09-15T21:00:00+08:00"),
};

// insert data
for await (const email of ADMIN_EMAILS) {
  await prisma.user.upsert({
    where: { email },
    update: {
      permission: 6, //Permission.AdminRead + Permission.AdminWrite,
    },
    create: {
      email,
      name: "Admin",
    },
  });
}

for await (const setting of SETTINGS) {
  await prisma.setting.upsert({
    where: { id: setting.id },
    update: setting,
    create: setting,
  });
}

await prisma.event.upsert({
  where: { id: WELCOME_PARTY.id },
  update: WELCOME_PARTY,
  create: WELCOME_PARTY,
});
