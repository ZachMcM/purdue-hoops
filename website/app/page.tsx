import Image from "next/image";
import mockupOne from "../public/main.png";
import mockupTwo from "../public/leaderboard.png";
import icon from "./favicon.ico";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SupportForm } from "@/components/SupportForm";
import { NotifyForm } from "@/components/NotifyForm";

export default function Component() {
  return (
    <div className="flex-1">
      {" "}
      <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-10 xl:px-32">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:gap-18 xl:grid-cols-[1fr_450px]">
            <Image
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-contain sm:w-full lg:order-last lg:aspect-square bg-[#ceb888]"
              height="550"
              src={mockupOne}
              width="550"
            />
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none">
                  Purdue Hoops: Your Pickup Basketball Companion
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl dark:text-muted-foreground">
                  Discover who's playing pickup basketball at the Purdue rec
                  center, track your stats, and connect with fellow ballers.
                </p>
              </div>
              <Link href="#">
                <Button>Coming Soon...</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm dark:bg-muted">
                Leaderboard
              </div>
              <h2 className="text-3xl font-bold sm:text-5xl">
                Track Your Progress
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-muted-foreground">
                See where you rank among your fellow Purdue ballers. Climb the
                leaderboard by playing more games and improving your stats.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <Image
              alt="Leaderboard"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-contain sm:w-full lg:order-last lg:aspect-square bg-[#ceb888]"
              height="550"
              width="550"
              src={mockupTwo}
            />
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Player Ratings</h3>
                    <p className="text-muted-foreground dark:text-muted-foreground">
                      Earn a rating based on your performance and sportsmanship.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Customizable Profiles</h3>
                    <p className="text-muted-foreground dark:text-muted-foreground">
                      Create a unique profile to showcase your skills and
                      connect with other players.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold">Pickup Game Finder</h3>
                    <p className="text-muted-foreground dark:text-muted-foreground">
                      See who's playing and when, so you can join the action.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold md:text-4xl/tight">
              Download Purdue Hoops Today
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-muted-foreground">
              Get the app and start connecting with your fellow Purdue ballers.
              Compete on the leaderboard, build your profile, and find pickup
              games.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <NotifyForm />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t" id="contact">
        <div className="container grid items-center justify-center gap-8 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold md:text-4xl/tight">
              Contact Support
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-muted-foreground">
              Have a question or need help? Reach out to our support team.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm lg:max-w-md space-y-2">
            <SupportForm />
          </div>
        </div>
      </section>
    </div>
  );
}
