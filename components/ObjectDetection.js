"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runCoco = async () => {
    setIsLoading(true);
    const net = await cocoSSDLoad();
    setIsLoading(false);
    const detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 10);
  };

  const runObjectDetection = async (net) => {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Find detected objects
      const detectedObjects = await net.detect(video, undefined, 0.6);

      // Draw the detected objects on the canvas
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      detectedObjects.forEach((item) => {
        ctx.beginPath();
        const [x, y, width, height] = item.bbox;
        ctx.lineWidth = 2;
        ctx.strokeStyle = item.class === "person" ? "#ff0000" : "#0000ff"; // Change stroke color for "person" class to red, others to cyan

        ctx.strokeRect(x, y, width, height);
        ctx.stroke();
        ctx.font = "24px Arial";

        // Fill the bounding box with color for "person" class
        if (item.class === "person") {
          ctx.fillStyle = "rgba(255, 0, 0, 0.2)"; // Red with 20% opacity
          ctx.fillRect(x, y, width, height);
        }

        // Draw the label background
        ctx.fillStyle = item.class === "person" ? "#ff0000" : "#0000ff"; // Change label background color for "person" class to red, others to cyan
        ctx.fillRect(x, y - 20, ctx.measureText(item.class).width + 10, 20);

        // Draw the label text
        ctx.fillStyle = "#ffffff"; // White text
        ctx.fillText(item.class, x + 5, y - 5);
      });
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <>
      <div className="mt-8 mx-auto px-10 flex items-center justify-center">
        {isLoading ? (
          <p>Loading AI Detection...</p>
        ) : (
          <>
            {/* Webcam */}
            <div className="relative aspect-video flex items-center rounded-md p-1.5 bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] justify-center">
              <Webcam
                ref={webcamRef}
                className="object-cover"
                muted
                videoConstraints={{
                  facingMode: "user",
                }}
              />
              {/* Canvas */}
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 z-99999 w-full"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ObjectDetection;