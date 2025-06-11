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

import { useEffect, useState } from "react";

import { X } from "lucide-react";
import { Pencil } from "lucide-react";
import axios from "axios";
import { de } from "date-fns/locale";
import { CircularProgress } from "@mui/material";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import EditDrawer from "./components/EditDrawer";
import dayjs from "dayjs";

export default function Home() {
  const currentDate = new Date();
  const [selected, setSelected] = useState(currentDate);
  const month =
    selected && selected?.toLocaleString("en-US", { month: "long" });
  const dayOfWeek =
    selected && selected?.toLocaleString("en-US", { weekday: "long" });
  const day = selected?.getDate();
  const year = selected?.getFullYear();

  const [idTracker, setIdTracker] = useState({});

  const baseUrl = "https://track-in-out-4874c-default-rtdb.firebaseio.com/";
  const daysEntryUrl = baseUrl + "days.json";

  const [enteredTimeStamp, setEnteredTimeStamp] = useState(null);
  const [exitTimeStamp, setExitTimeStamp] = useState(null);

  const [isEnteredIn, setIsEnteredIn] = useState(false);
  const [isExited, setIsExited] = useState(false);
  const [workedDays, setWorkedDays] = useState([]);
  const [bookedDays, setBookedDays] = useState([]);
  const [inDays, setInDays] = useState([]);
  const [isInitalEntiresLoading, setIsInitialEntriesLoading] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Load all the entries and set the id tracker for each of the date
    function getTrackIdsForIntialEntries(entires) {
      const curTracker = {};
      for (let id in entires) {
        const curDay = entires[id].day;
        curTracker[curDay] = id;
      }
      setIdTracker((prev) => {
        return { ...prev, ...curTracker };
      });
    }

    function getInDaysFromInitialEntires(entires) {
      const curInDays = entires
        .filter((entry) => entry.status == "ENTERED")
        .map((val) => new Date(val.day));

      setInDays((prev) => [...prev, ...curInDays]);
    }
    function getBookedDaysFromInitialEntires(entires) {
      const curBookedDays = entires
        .filter((entry) => entry.status == "EXITED")
        .map((val) => new Date(val.day));

      setBookedDays((prev) => [...prev, ...curBookedDays]);
    }
    async function getInitialEntries() {
      const entires = await axios.get(daysEntryUrl);
      const intialWorkedDays = entires.data ? Object.values(entires.data) : [];

      setWorkedDays(intialWorkedDays);
      getTrackIdsForIntialEntries(entires.data);
      getInDaysFromInitialEntires(intialWorkedDays);
      getBookedDaysFromInitialEntires(intialWorkedDays);
      setIsInitialEntriesLoading(false);
      console.log("Initial Data", workedDays);
    }
    getInitialEntries();
  }, []);

  useEffect(() => {
    if (!isInitalEntiresLoading) {
      handleSelectedDate(currentDate);
    }
  }, [isInitalEntiresLoading]);

  useEffect(() => {
    if (isEnteredIn) {
      const val = getProgressValue(enteredTimeStamp);
      setProgressValue(val);
    }
  }, [isEnteredIn, enteredTimeStamp]);

  function handleEntryExitReset() {
    setIsEnteredIn(false);
    setIsExited(false);
    setInDays((prev) =>
      prev.filter(
        (day) =>
          day.toLocaleDateString("en-US") !=
          selected.toLocaleDateString("en-US")
      )
    );
    setBookedDays((prev) =>
      prev.filter(
        (day) =>
          day.toLocaleDateString("en-US") !=
          selected.toLocaleDateString("en-US")
      )
    );
    setWorkedDays((prev) =>
      prev.filter((days) => days.day != selected.toLocaleDateString("en-US"))
    );
    const id = idTracker[selected.toLocaleDateString("en-US")];
    const deleteUrl = baseUrl + "/days/" + id + ".json";
    axios.delete(deleteUrl);
  }

  async function handleEnteredInState() {
    const curDate = new Date(getTimeStampFromDate(selected));
    setEnteredTimeStamp(curDate.toLocaleString("en-US"));
    setIsEnteredIn(true);
    // Handle adding an entry to the database
    const data = {
      id: null,
      day: selected.toLocaleDateString("en-US"),
      userId: null,
      status: "ENTERED",
      enteredTimeStamp: curDate.toLocaleString("en-US"),
      exitTimeStamp: null,
      minDuration: null,
    };
    setWorkedDays((prev) => [...prev, data]);
    setInDays((prev) => [...prev, curDate]);
    const res = await axios.post(daysEntryUrl, data);
    setIdTracker((prev) => {
      return {
        ...prev,
        [curDate.toLocaleDateString("en-US")]: res.data.name,
      };
    });
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
    setExitTimeStamp(curDate.toLocaleString("en-US"));
    setIsExited(true);
    setWorkedDays((prev) => {
      return prev.map((curDay) => {
        if (curDay.day == curDate.toLocaleDateString("en-US")) {
          let data = {
            ...curDay,
            exitTimeStamp: curDate.toLocaleString("en-US"),
            status: "EXITED",
          };
          const id = idTracker[curDate.toLocaleDateString("en-US")];
          const patchUrl = baseUrl + "/days/" + id + ".json";
          axios.put(patchUrl, data);
          console.log("EXIT_API", data);
          return data;
        } else {
          return curDay;
        }
      });
    });

    setInDays((prev) =>
      prev.filter(
        (day) =>
          day.toLocaleDateString("en-US") != curDate.toLocaleDateString("en-US")
      )
    );
    setBookedDays((prev) => [...prev, curDate]);
  }

  function getProgressValue(enteredTImeStamp) {
    const now = new Date();

    const diff = (now - new Date(enteredTImeStamp)) / (60 * 1000);

    const val = (diff / (60 * 6)) * 100;
    console.log("DIFFF", diff, val);
    return val;
  }
  console.log("workedDays", workedDays);
  console.log("SELECTED", selected);
  console.log("INDays", inDays);
  console.log("Booked", bookedDays);

  function handleSelectedDate(date) {
    console.log("SELECT TRiggered");
    setSelected(date);
    //get and set timeStamp for enter and exit based on the date
    const curDayDetails = workedDays.filter(
      (curDay) => curDay.day == date.toLocaleDateString("en-US")
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

  function handleEditTimeStamp(time, mode) {
    if (mode == "enter") {
      setEnteredTimeStamp(time);

      setWorkedDays((entires) => {
        return entires.map((entry) => {
          if (entry.day == selected.toLocaleDateString("en-US")) {
            const data = {
              ...entry,
              enteredTimeStamp: time,
            };
            const id = idTracker[selected.toLocaleDateString("en-US")];
            const patchUrl = baseUrl + "/days/" + id + ".json";
            axios.put(patchUrl, data);
            return data;
          } else {
            return entry;
          }
        });
      });
    } else {
      setExitTimeStamp(time);
      setWorkedDays((entires) => {
        return entires.map((entry) => {
          if (entry.day == selected.toLocaleDateString("en-US")) {
            const data = {
              ...entry,
              exitTimeStamp: time,
            };
            const id = idTracker[selected.toLocaleDateString("en-US")];
            const patchUrl = baseUrl + "/days/" + id + ".json";
            axios.put(patchUrl, data);
            return data;
          } else {
            return entry;
          }
        });
      });
    }
    console.log("Edited-time", time, mode);
  }
  const timeSpent = () => {
    const start = dayjs(enteredTimeStamp);
    const end = isExited ? dayjs(exitTimeStamp) : dayjs(new Date());
    const diff = end.diff(start, "minute");
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    const formatted = `${hrs}h ${mins.toString().padStart(2, "0")}m`;
    return formatted;
  };
  if (isInitalEntiresLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  } else
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
          disabled={{ after: currentDate }}
          // className="rounded-lg border shadow-sm"
        ></Calendar>
        {selected ? (
          <Card className={"md:h-[calc(100%-30px)] mx-5 flex-1"}>
            <CardHeader>
              <CardTitle className={"flex gap-1"}>
                {selected && day + " " + month}
                <p className="ml-auto">{dayOfWeek}</p>
              </CardTitle>
              <CardDescription>Selected Date</CardDescription>
            </CardHeader>
            <CardContent className={"h-[100%]"}>
              {isEnteredIn && !isExited && (
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">
                    You've successfully checked in, time in: {timeSpent()}
                  </p>
                  <Progress value={progressValue}></Progress>
                </div>
              )}
              {isExited && (
                <p className="text-muted-foreground">
                  You are at office today for {timeSpent()}
                </p>
              )}
              {selected && !isEnteredIn && (
                <p className="text-muted-foreground">Ready for Work?</p>
              )}
            </CardContent>
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
                        className="md:w-min w-full text-[0.9rem]"
                      >
                        Time in
                      </Badge>
                      <div className="self-center flex items-center gap-2">
                        <div className="flex-1">
                          {dayjs(enteredTimeStamp).format("h:mm A")}
                        </div>
                        <EditDrawer
                          curTime={enteredTimeStamp}
                          handleEditTimeStamp={handleEditTimeStamp}
                          mode={"enter"}
                        />
                      </div>
                    </div>
                  )}
                </li>

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
                          className="md:w-min w-full text-[0.9rem]"
                        >
                          Time out
                        </Badge>
                        <div className="self-center flex items-center gap-2">
                          {dayjs(exitTimeStamp).format("h:mm A")}
                          <EditDrawer
                            curTime={enteredTimeStamp}
                            handleEditTimeStamp={handleEditTimeStamp}
                            mode={"exit"}
                          />
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
        ) : (
          <div className="p-4 md:h-[calc(100%-30px)] mx-5 flex-1">
            <Alert variant="default | destructive">
              <AlertTitle>Select Date</AlertTitle>
              <AlertDescription>
                Please select a date to continue tracking!
                <div className="flex items-center gap-2">
                  <Badge className={"size-4 bg-amber-600"}></Badge>
                  <p>Entered Office</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={"size-4 bg-emerald-600"}></Badge>
                  <p> Reported Office</p>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    );
}
