import React, { useState } from "react";
import Lottie from "react-lottie-player";
import animationData from "@/public/assets/drinkAnimation.json"; // Correct import

export const DrinkLoading = () => {

  return (
    <div className="flex items-start pt-48 md:pt-0 md:items-center justify-center min-h-screen">
      <Lottie
        loop
        play={true}
        animationData={animationData}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};
