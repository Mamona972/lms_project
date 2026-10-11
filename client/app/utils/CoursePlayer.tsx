
import React, { FC, useEffect, useState } from "react";
import axios from "axios";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!videoUrl) return;

    const getVideoOTP = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        setVideoData({ otp: "", playbackInfo: "" });
      
        
console.log("Video URL/ID being sent:", videoUrl);

const res = await axios.post(
  "http://localhost:8000/api/v1/getVdoCipherOTP",
  { videoId: videoUrl }
);

console.log("VdoCipher response:", res.data);

if (!res.data?.otp || !res.data?.playbackInfo) {
  throw new Error("OTP or playback information is missing.");
}

setVideoData({
  otp: res.data.otp,
  playbackInfo: res.data.playbackInfo,
});
      
} catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error("OTP ERROR MESSAGE:", error.message);
    console.error("OTP ERROR STATUS:", error.response?.status);
    console.error("OTP ERROR DATA:", error.response?.data);
    console.error("OTP REQUEST URL:", error.config?.url);

    setErrorMessage(
      error.response?.data?.message ||
      error.message ||
      "Unable to load the video."
    );
  } else {
    console.error("Unexpected OTP error:", error);
    setErrorMessage("An unexpected error occurred.");
  }
} finally {
  setLoading(false);
}


    };

    getVideoOTP();
  }, [videoUrl]);

  return (
    <div
      style={{
        paddingTop: "56.25%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        {loading && <p>Loading video...</p>}

        {!loading && errorMessage && (
          <p>{errorMessage}</p>
        )}

        {!loading &&
          !errorMessage &&
          videoData.otp &&
          videoData.playbackInfo && (
            <iframe
              src={`https://player.vdocipher.com/v2/?otp=${encodeURIComponent(
                videoData.otp
              )}&playbackInfo=${encodeURIComponent(
                videoData.playbackInfo
              )}`}
              title={title}
              style={{
                border: 0,
                position: "absolute",
                inset: 0,
                height: "100%",
                width: "100%",
              }}
              allowFullScreen
              allow="encrypted-media"
            />
          )}
      </div>
    </div>
  );
};

export default CoursePlayer;

