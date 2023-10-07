const usePickerOptions = (maxSelectedMonth: number = 12) => {
  // 不能限制到当前时分秒，否则用户无法选择

  let stratTime: number;

  const calendarChange = (val: Date[]) => {
    if (val.length) {
      stratTime = val[0].getTime();
    }
  };

  const disabledDate = (time: any): boolean => {
    if (stratTime) {
      const maxDay = 31 * maxSelectedMonth - Math.floor(maxSelectedMonth / 2); // 3个月最多92天
      const one = (maxDay - 1) * 24 * 3600 * 1000; // 31天比较合适 因为一个月最多31天
      const minTime = stratTime - one;
      const maxTime = stratTime + one;
      return time.getTime() < minTime || time.getTime() > maxTime;
    }
    return false;
  };

  return {
    calendarChange,
    disabledDate,
  };
};

export default usePickerOptions;
