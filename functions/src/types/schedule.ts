import { Timestamp } from 'firebase-admin/firestore'
import { abstractQuestion } from './question'
import { WeekdayNumbers } from 'luxon'

export interface oftenScheduleParams {
  minutes: number
  firstrun: boolean
}
export interface dailyScheduleParams {
  time: string
}
export interface weeklyScheduleParams {
  day: WeekdayNumbers
  time: string
}

export type params = oftenScheduleParams | dailyScheduleParams | weeklyScheduleParams

export interface schedule {
  question: abstractQuestion
  chat: number
  type: 'often' | 'daily' | 'weekly'
  parameters: params
  scheduled: Timestamp
}
