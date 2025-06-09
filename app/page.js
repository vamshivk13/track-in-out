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

export default function Home() {
  const currentDate = new Date();
  const [selected, setSelected] = useState(currentDate);
  const month =
    selected && selected?.toLocaleString("default", { month: "long" });
  const dayOfWeek =
    selected && selected?.toLocaleString("default", { weekday: "long" });
  const day = selected?.getDate();
  const year = selected?.getFullYear();
  // console.log(typeof selected, selected.toLocaleString())
  return (
    <div className="flex gap-4 py-10 flex-col md:flex-row sm:flex-col md:h-[100%] h-[calc(100%-30px)]  ">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
        className={"self-center md:self-baseline min-h-[300px]"}
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
          {/* <ul className="flex justify-between p-10">
          <li><Button variant="outline" >Enter</Button></li>
          <li><Button variant={"outline"}>Exit</Button></li>
           </ul> */}

          <ul className="flex gap-2 justify-between px-4">
            <li className="border my-auto rounded-2xl p-3  flex flex-col md:flex-row gap-3 justify-center align-middle">
              <Badge variant="default" className="md:w-min w-full">
                Time in
              </Badge>
              <p>{currentDate.toLocaleTimeString()}</p>
            </li>
            {/* <li className="rounded-2xl overflow-hidden">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticTimePicker defaultValue={dayjs('2022-04-17T15:30')} />
            </LocalizationProvider>
              </li> */}
            <li className="border my-auto rounded-2xl p-3  flex flex-col md:flex-row gap-3 justify-center align-middle">
              <Badge variant="default" className="md:w-min w-full">
                Time out
              </Badge>
              <p>{currentDate.toLocaleTimeString()}</p>
            </li>
          </ul>
        </CardAction>
      </Card>
    </div>
  );
}
