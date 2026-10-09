import React, { FC, useEffect, useState } from 'react'
import axios from "axios"
type Props = {
    videoUrl:string;
    title:string
}

const CoursePlayer:FC<Props> = ({videoUrl,title}) => {
const [videoData, setVideoData]= useState({
    otp:"",
    playbackInfo:"",
})

useEffect(()=>{
    console.log("VdoCipher videoId:", videoUrl);

    axios.post("http://localhost:8000/api/v1/getVdoCipherOTP",{
        videoId: videoUrl,

    }).then((res)=>{
        console.log("VdoCipher response:", res.data);
        setVideoData(res.data);

    }).catch((error) => {
        console.log("OTP ERROR:", error.response?.data || error);
    });
}, [videoUrl]);

  return (
    <div
      style={{
        paddingTop: "56.25%",
        position: "relative",
        overflow:"hidden"
      }}
    >
      {videoData.otp && videoData.playbackInfo !=="" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
          title={title}
          style={{
            border: 0,
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        />
      )}
    </div>
  );
};
export default CoursePlayer