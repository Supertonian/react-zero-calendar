const datetime = {
  dayLabel: { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ko: ['일', '월', '화', '수', '목', '금', '토'] },
  getDayName(dow, country) {
    if (Object.keys(this.dayLabel).includes(country)) {
      return this.dayLabel[country][dow];
    }
    return this.dayLabel.en.dow;
  },
};

export default datetime;
