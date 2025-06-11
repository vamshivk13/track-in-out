"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Cone, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalizationProvider, StaticTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const EditDrawer = ({ curTime, handleEditTimeStamp, mode }) => {
  const [time, setTime] = useState(dayjs(curTime));

  return (
    <Drawer onOpenChange={() => setTime(dayjs(curTime))}>
      <DrawerTrigger>
        <Button variant={"outlined"} className="size-4">
          <Pencil />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{mode == "enter" ? "Time In" : "Time Out"}</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* <div className="w-30 h-30"> */}
          <ThemeProvider theme={darkTheme}>
            <StaticTimePicker
              defaultValue={dayjs("2022-04-17T15:30")}
              value={time}
              onChange={(newValue) => setTime(newValue)}
              slots={{
                actionBar: (props) => {
                  return (
                    <Box sx={{ display: "grid", gridColumn: "3" }}>
                      <Box sx={{ display: "flex", padding: 1 }}>
                        <DrawerClose>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                        <DrawerClose>
                          <Button
                            onClick={() =>
                              handleEditTimeStamp(
                                time.toDate().toLocaleString(),
                                mode
                              )
                            }
                          >
                            Submit
                          </Button>
                        </DrawerClose>
                      </Box>
                    </Box>
                  );
                },
              }}
              onAccept={(e) => console.log("On ACCEPT", e)}
            />
          </ThemeProvider>

          {/* </div> */}
        </LocalizationProvider>
        {/* <DrawerFooter>
          
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};

export default EditDrawer;
