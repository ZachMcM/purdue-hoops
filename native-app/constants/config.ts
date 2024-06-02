export const hoopingStatuses = [
  {
    value: "gold-and-black",
    label: "Gold and Black Gyms",
  },
  {
    value: "feature",
    label: "Feature Gym",
  },
  {
    value: "upper",
    label: "Upper Gym",
  },
  {
    value: "not-hooping",
    label: "Not Hooping",
  },
];

export const hoopingStatusesEnum = [
  "gold-and-black",
  "feature",
  "upper",
  "not-hooping",
] as const;

export type HoopingStatus = (typeof hoopingStatusesEnum)[number];

export const positions = [
  {
    value: "pg",
    label: "Point Guard",
  },
  {
    value: "sg",
    label: "Shooting Guard",
  },
  {
    value: "sf",
    label: "Small Forward",
  },
  {
    value: "pf",
    label: "Power Forward",
  },
  {
    value: "c",
    label: "Center",
  },
  {
    value: "cg",
    label: "Combo Guard",
  },
];

export const positionsEnum = ["pg", "sg", "sf", "pf", "c", "cg"] as const;

export const skills = [
  {
    value: "slasher",
    label: "Slasher",
  },
  {
    value: "sharpshooter",
    label: "Sharpshooter",
  },
  {
    value: "playmaker",
    label: "Playmaker",
  },
  {
    value: "lockdown",
    label: "Lockdown Defender",
  },
  {
    value: "glass",
    label: "Glass Cleaner",
  },
  {
    value: "shot-creator",
    label: "Shot Creator",
  },
  {
    value: "post-scorer",
    label: "Post Scorer",
  },
];

export const skillsEnum = [
  "slasher",
  "sharpshooter",
  "playmaker",
  "lockdown",
  "glass",
  "shot-creator",
  "post-scorer",
] as const;
