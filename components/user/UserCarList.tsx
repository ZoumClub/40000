"use client";

import { UserCarCard } from "./UserCarCard";
import type { UserCar } from "@/lib/modules/user-cars/types";

interface UserCarListProps {
  cars: UserCar[];
}

export function UserCarList({ cars }: UserCarListProps) {
  if (!cars.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          You haven&apos;t listed any cars yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cars.map((car) => (
        <UserCarCard key={car.id} car={car} />
      ))}
    </div>
  );
}