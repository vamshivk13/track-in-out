"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocalizationProvider, StaticTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import { useState } from "react";

import { X } from "lucide-react";
import { Pencil } from "lucide-react";

export default function Home() {
  const currentDate = new Date();
  const [selected, setSelected] = useState(currentDate);
  const month =
    selected && selected?.toLocaleString("default", { month: "long" });
  const dayOfWeek =
    selected && selected?.toLocaleString("default", { weekday: "long" });
  const day = selected?.getDate();
  const year = selected?.getFullYear();

  const [enteredTimeStamp, setEnteredTimeStamp] = useState(null);
  const [exitTimeStamp, setExitTimeStamp] = useState(null);

  const [isEnteredIn, setIsEnteredIn] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [workedDays, setWorkedDays] = useState([]);
  const [bookedDays, setBookedDays] = useState([]);
  const [inDays, setInDays] = useState([]);

  function handleEntryExitReset() {
    setIsEnteredIn(false);
    setIsExited(false);
    setInDays((prev) =>
      prev.filter(
        (day) => day.toLocaleDateString() != selected.toLocaleDateString()
      )
    );
    setBookedDays((prev) =>
      prev.filter(
        (day) => day.toLocaleDateString() != selected.toLocaleDateString()
      )
    );
    setWorkedDays((prev) =>
      prev.filter((days) => days.day != selected.toLocaleDateString())
    );
  }

  function handleEnteredInState() {
    const curDate = new Date(getTimeStampFromDate(selected));
    setEnteredTimeStamp(curDate.toLocaleTimeString());
    setIsEnteredIn(true);
    // Handle adding an entry to the database
    setWorkedDays((prev) => [
      ...prev,
      {
        day: selected.toLocaleDateString(),
        userId: null,
        status: "ENTERED",
        enteredTimeStamp: curDate.toLocaleTimeString(),
        exitTimeStamp: null,
        minDuration: null,
      },
    ]);
    setInDays((prev) => [...prev, curDate]);
  }

  function getTimeStampFromDate(date) {
    const curTime = new Date();
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      curTime.getHours(),
      curTime.getMinutes(),
      curTime.getSeconds()
    );
  }

  function handleExitState() {
    const curDate = new Date(getTimeStampFromDate(selected));
    setExitTimeStamp(curDate.toLocaleTimeString());
    setIsExited(true);
    setWorkedDays((prev) => {
      return prev.map((curDay) => {
        console.log("LcoalDate", curDate.toLocaleDateString());
        if (curDay.day == curDate.toLocaleDateString()) {
          return {
            ...curDay,
            exitTimeStamp: curDate.toLocaleTimeString(),
            status: "Exited",
          };
        } else {
          return curDay;
        }
      });
    });
    setInDays((prev) =>
      prev.filter(
        (day) => day.toLocaleDateString() != curDate.toLocaleDateString()
      )
    );
    setBookedDays((prev) => [...prev, curDate]);
  }

  console.log("workedDays", workedDays);
  console.log("SELECTED", selected);
  console.log("INDays", inDays);
  console.log("Booked", bookedDays);
  function handleSelectedDate(date) {
    setSelected(date);
    //get and set timeStamp for enter and exit based on the date
    const curDayDetails = workedDays.filter(
      (curDay) => curDay.day == date.toLocaleDateString()
    )[0];
    if (curDayDetails) {
      setIsEnteredIn(!!curDayDetails.enteredTimeStamp);
      setIsExited(!!curDayDetails.exitTimeStamp);
      setEnteredTimeStamp(curDayDetails.enteredTimeStamp);
      setExitTimeStamp(curDayDetails.exitTimeStamp);
    } else {
      setIsEnteredIn(false);
      setIsExited(false);
      setEnteredTimeStamp(null);
      setExitTimeStamp(null);
    }
  }
  return (
    <div className="flex gap-4 py-3 md:py-8 flex-col md:flex-row sm:flex-col md:h-[100%] h-[calc(100%-60px)] px-0 md:px-3">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={handleSelectedDate}
        className={"self-center md:self-baseline"}
        modifiers={{
          booked: bookedDays,
          in: inDays,
        }}
        modifiersClassNames={{
          booked: "[&>button]:!bg-emerald-600",
          in: "[&>button]:!bg-amber-600",
          today: "initial",
        }}
        // className="rounded-lg border shadow-sm"
      ></Calendar>
      <Card className={"md:h-[calc(100%-30px)] mx-5 flex-1"}>
        <CardHeader>
          <CardTitle className={"flex gap-1"}>
            {selected && day + " " + month}
            <p className="ml-auto">{dayOfWeek}</p>
          </CardTitle>
          <CardDescription>Selected Date</CardDescription>
        </CardHeader>
        <CardContent className={"h-[100%]"}></CardContent>
        <CardAction className={"w-full"}>
          <ul className="flex gap-2 px-4 items-center ">
            <li className="flex-1">
              {!isEnteredIn ? (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleEnteredInState}
                >
                  Enter In
                </Button>
              ) : (
                <div className="border my-auto rounded-2xl p-3  flex flex-col md:flex-row gap-3 md:justify-between ">
                  <Badge
                    variant="default"
                    className="md:w-min w-full text-[1rem]"
                  >
                    Time in
                  </Badge>
                  <div className="self-center flex items-center gap-2">
                    <div className="flex-1">{enteredTimeStamp}</div>
                    <Button variant={"outlined"} className="size-4">
                      <Pencil />
                    </Button>
                  </div>
                </div>
              )}
            </li>
            {/* <li className="rounded-2xl overflow-hidden">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
            </LocalizationProvider>
              </li> */}
            {isEnteredIn && (
              <li className="flex-1">
                {!isExited && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleExitState}
                  >
                    Exit
                  </Button>
                )}
                {isExited && (
                  <div className="border my-auto rounded-2xl p-3  flex flex-col md:flex-row gap-3 md:justify-between ">
                    <Badge
                      variant="default"
                      className="md:w-min w-full text-[1rem]"
                    >
                      Time out
                    </Badge>
                    <div className="self-center flex items-center gap-2">
                      {exitTimeStamp}
                      <Button variant={"outlined"} className="size-4">
                        <Pencil />
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            )}
            {isEnteredIn && (
              <Button
                variant={"outlined"}
                className="size-4"
                onClick={handleEntryExitReset}
              >
                <X />
              </Button>
            )}
          </ul>
        </CardAction>
      </Card>
    </div>
  );
}
