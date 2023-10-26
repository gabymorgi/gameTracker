import { PrismaClient } from "@prisma/client";

export type TransactionalPrismaClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export interface ExtraScoreI {
  bias: string;
  info: string;
}

interface ScoreI {
  content?: string;
  lore?: string;
  mechanics?: string;
  bosses?: string;
  controls?: string;
  music?: string;
  graphics?: string;
  extra?: Array<ExtraScoreI>;
  finalMark: string;
}

export interface BaseGameI {
  id: string;
  name: string;
  playedTime: number;
  extraPlayedTime: number | null;
  imageUrl: string;
  appid: number | null;
  start: number;
  end: number;
  obtainedAchievements: number;
  totalAchievements: number;
  scoreId: string | null;
  stateId: string;
}

export interface GameI {
  id: string;
  appid?: string;
  name: string;
  start: string;
  tags: Array<string>;
  state: string;
  end: string;
  playedTime: string;
  extraPlayedTime?: string;
  score?: ScoreI;
  imageUrl?: string;
  achievements: [string, string];
}

export interface ChangeLogI {
  createdAt: string;
  hours: string;
  achievements: string;
  state: string;
}

export interface QueryStringParams {
  page?: string;
  pageSize?: string;
  name?: string;
  start?: string;
  end?: string;
  state?: string;
  tags?: string;
  appids?: string;
  sortBy?: string;
  sortDirection?: string;
}
