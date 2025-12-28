declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar
    getLunar(): Lunar
  }

  export class Lunar {
    getYear(): number
    getMonth(): number
    getDay(): number
    getYearInGanZhi(): string
    getYearShengXiao(): string
    getMonthInChinese(): string
    getDayInChinese(): string
  }
}