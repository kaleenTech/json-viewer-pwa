"use client"
import moment from "moment";
import { useEffect, useState } from "react";

export default function Timer() {
  const [jsonData, setJsonData] = useState([]);
  const [input, setInput] = useState("");
  const checkInTime = jsonData?.find(
    (item) => item?.type === "checkIn"
  )?.createdAt;
  const breakInTime = jsonData?.find(
    (item) => item?.type === "breakIn"
  )?.createdAt;
  const breakOutTime = jsonData?.find(
    (item) => item?.type === "breakOut"
  )?.createdAt;
  const checkIn = moment(checkInTime);
  const breakIn = moment(breakInTime);
  const breakOut = moment(breakOutTime);
  const [currentTime, setCurrentTime] = useState(moment());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const formatTime = (ms) => moment.utc(ms).format("HH:mm:ss");

  const calculateBreakTime = () => {
    const breakInTimes = jsonData
      ?.filter((item) => item.type === "breakIn")
      ?.map((item) => moment(item.createdAt));

    const breakOutTimes = jsonData
      ?.filter((item) => item.type === "breakOut")
      ?.map((item) => moment(item.createdAt));

    let totalBreakTime = 0;
    for (let i = 0; i < breakInTimes?.length; i++) {
      if (breakOutTimes[i]) {
        totalBreakTime += breakOutTimes[i].diff(breakInTimes[i]);
      }
    }
    return totalBreakTime;
  };
  const calculateActiveTime = () => {
    if (breakOutTime === undefined) {
      const totalTime = checkIn.diff(breakTime);
      return totalTime;
    } else {
      const totalTime = currentTime.diff(checkIn);
      const breakTime = calculateBreakTime();
      return totalTime - breakTime;
    }
  };
  const breakTime = calculateBreakTime();
  const calculateRemainingTime = () => {
    const eightHoursInMs = 8 * 60 * 60 * 1000;
    const activeTime = calculateActiveTime();
    const remainingTime = eightHoursInMs - activeTime;
    return remainingTime > 0 ? remainingTime : 0;
  };

  const formatRemainingTime = (remainingTime) => {
    const duration = moment.duration(remainingTime);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateEndTime = () => {
    const remainingTime = calculateRemainingTime();
    const endTime = currentTime.clone().add(remainingTime, "milliseconds");
    return endTime;
  };

  // const calculateEndTime = () => {
  //     const eightHoursInMs = 8 * 60 * 60 * 1000;
  //     const activeTime = calculateActiveTime();
  //     const remainingTime = eightHoursInMs - activeTime;
  //     const endTime = currentTime.clone().add(remainingTime, 'milliseconds');
  //     return endTime;
  // };

  const remainingTime = calculateRemainingTime();
  const endTime = calculateEndTime();
  const activeTime = calculateActiveTime();

  // const endTime = calculateEndTime();
  return (
    <div className="timer-container">
      <h2>Timer</h2>
      <textarea
        className="textarea"
        rows={5}
        value={input}
        onChange={(event) => {
          setInput(event?.target?.value);
        }}
      ></textarea>
      <button
        className="button"
        onClick={() => {
          setJsonData(JSON.parse(input));
        }}
      >
        SAVE
      </button>
      {jsonData?.length > 0 && (
        <div className="time-info">
          <div>Check In: {checkIn.format("YYYY-MM-DD hh:mm:ss A")}</div>
          <div>Break In: {breakIn.format("YYYY-MM-DD hh:mm:ss A")}</div>
          <div>Break Out: {breakOut.format("YYYY-MM-DD hh:mm:ss A")}</div>
          <div className="break-time">
            Break Time:{" "}
            {breakOutTime === undefined
              ? formatTime(currentTime.diff(breakIn))
              : formatTime(breakTime)}
          </div>
          <div className="active-time">
            Active Time: {formatTime(activeTime)}
          </div>
          <div className="break-time">
            End Time: {endTime.format("hh:mm:ss A")}
          </div>
          <div className="remaining-time">
            Remaining Time: {formatRemainingTime(remainingTime)}
          </div>
        </div>
      )}
    </div>
  );
}
