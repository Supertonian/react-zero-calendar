import { DateTime } from 'luxon';

const datetime = {
  dayLabel: {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ko: ['일', '월', '화', '수', '목', '금', '토'],
  },
  getDayName(dow: number, country: string): string {
    if (Object.keys(this.dayLabel).includes(country)) {
      return this.dayLabel[country][dow];
    }
    return this.dayLabel.en.dow;
  },
  toLuxon(a: string): any {
    return DateTime.fromJSDate(new Date(a));
  },
};

export default datetime;
