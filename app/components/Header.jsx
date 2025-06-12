"use client";
import { Separator } from "@radix-ui/react-separator";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import img from "../../public/vk.svg";
const Header = () => {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-base font-medium">Track It</h1>
      <Avatar className="w-8 h-8 ml-auto mr-4">
        <AvatarImage
          alt="l"
          src={"./vk.svg"}
          className="h-full w-full rounded-3xl bg-white"
        ></AvatarImage>
        <AvatarFallback>sa</AvatarFallback>
      </Avatar>
    </header>
  );
};

export default Header;
