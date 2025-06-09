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

  const isEnteredIn = false;
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
          <ul className="flex gap-2 px-4 items-center">
            <li className="flex-1">
              {isEnteredIn ? (
                <Button variant="outline">Exit</Button>
              ) : (
                <div className="border my-auto rounded-2xl p-3  flex flex-col md:flex-row gap-3 md:justify-between ">
                  <Badge
                    variant="default"
                    className="md:w-min w-full text-[1rem]"
                  >
                    Time in
                  </Badge>
                  <div className="self-center flex items-center gap-2">
                    <div className="flex-1">
                      {currentDate.toLocaleTimeString()}
                    </div>
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
            <li className="flex-1">
              {isEnteredIn ? (
                <Button variant="outline">Exit</Button>
              ) : (
                <div className="border my-auto rounded-2xl p-3  flex flex-col md:flex-row gap-3 md:justify-between ">
                  <Badge
                    variant="default"
                    className="md:w-min w-full text-[1rem]"
                  >
                    Time out
                  </Badge>
                  <div className="self-center flex items-center gap-2">
                    {currentDate.toLocaleTimeString()}
                    <Button variant={"outlined"} className="size-4">
                      <Pencil />
                    </Button>
                  </div>
                </div>
              )}
            </li>
            <Button variant={"outlined"} className="size-4">
              <X />
            </Button>
          </ul>
        </CardAction>
      </Card>
    </div>
  );
}
