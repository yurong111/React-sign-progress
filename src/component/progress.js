import React from "react";
import "./progress.css";
import dateFns from "date-fns";

class SignProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static defaultProps = {
    successSignDays: 3,
    isSignToday: true,
    todayPosition: 3,
    days: 7
  };

  // 判断成功签数组信息[ture, true, false, false, false, ...]
  getSignDaysInfo = () => {
    let { successSignDays, isSignToday, todayPosition, days } = this.props;
    let signDateInfo = [];
    if (successSignDays) {
      // 数组下标大于等于n, 小于等于m，之间的数据为true，代表已签到
      let ge = 0; //数组下标大于等于
      let le = isSignToday ? todayPosition : todayPosition - 1; //数组下标小于等于
      if (successSignDays <= todayPosition) {
        ge = isSignToday
          ? todayPosition - successSignDays + 1
          : todayPosition - successSignDays;
      }

      for (let i = 0; i < days; i++) {
        let position = i + 1; // 下标位置，从1开始
        let res = position >= ge && position <= le ? true : false;
        signDateInfo.push(res);
      }
    }

    return signDateInfo;
  };

  // 返回基础日期信息，包括日期和日期对应积分值
  // 判断今天所在位置 返回前n-1天开始的日期
  getBasicDateInfo = signDaysInfo => {
    let { successSignDays } = this.props;
    if (!signDaysInfo) return [];

    if (successSignDays) {
      return this.handleSignData(signDaysInfo);
    } else {
      return this.handleNoSignData();
    }
  };

  // 存在签到的情况
  handleSignData = signDaysInfo => {
    let { successSignDays, todayPosition, isSignToday } = this.props;
    let startDate = dateFns.subDays(new Date(), todayPosition - 1);
    let startPosition = isSignToday // 签到第一天积分值的位置
      ? todayPosition - successSignDays
      : todayPosition - successSignDays - 1;

    let startPoint = 1; // 0位置的开始积分
    startPoint = startPosition > 0 ? 0 : Math.abs(startPosition) + 1;

    return this.getDataList(startPoint, startPosition);
  };

  // 不存在签到的情况
  handleNoSignData = () => {
    let { todayPosition } = this.props; // 从今天的位置开始算起
    return this.getDataList(0, todayPosition - 1);
  };

  getDataList = (point, startPosition) => {
    let { todayPosition, days } = this.props;
    let startDate = dateFns.subDays(new Date(), todayPosition - 1);

    let dataList = [];
    for (let i = 0; i < days; i++) {
      if (startPosition === i) {
        point = 1; // 开始位置时，且开始位置在可视范围，积分重置
      }

      let date = dateFns.addDays(startDate, i);
      dataList.push({
        dateStr: dateFns.format(date, "M:DD"),
        point
      });

      point && point++;
    }

    return dataList;
  };

  render() {
    let { successSignDays, days } = this.props;

    if (successSignDays < 0) {
      return null;
    }
    let signDaysInfo = this.getSignDaysInfo();
    let basicDateInfo = this.getBasicDateInfo(signDaysInfo);

    return (
      <div className="box">
        <div className="basic">
          {basicDateInfo.map((item, i) => {
            return (
              <div className="basicDay">
                <div className="day">+{item.point}</div>
                <div className="date">{item.dateStr}</div>
              </div>
            );
          })}
        </div>

        <div className="sign">
          {signDaysInfo &&
            signDaysInfo.map(item => {
              console.log("item", item);
              return (
                <div className={`signDay ${!item && "disabled"}`}>
                  <div className="day">X</div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default SignProgress;
