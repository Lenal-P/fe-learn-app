import React, { useRef, useState, useEffect } from "react";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

type ThongTinVideo = {
  uploader: string; // Tên người tải lên
  title: string; // Tiêu đề video
};

type ShortVideoProps = {
  src: string;
  poster: string;
  alt: string;
  videoInfo?: ThongTinVideo;
  autoPlay?: boolean; // Thuộc tính mới để tự động phát
};

const ShortVideo: React.FC<ShortVideoProps> = ({
  src,
  poster,
  alt,
  videoInfo,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [volume, setVolume] = useState(1); // Âm lượng mặc định (100%)
  const [isMuted, setIsMuted] = useState(false); // Trạng thái tắt tiếng
  const [isVolumeHovered, setIsVolumeHovered] = useState(false); // Trạng thái hover vào nút âm lượng
  const [volumeTimeout, setVolumeTimeout] = useState<NodeJS.Timeout | null>(
    null
  ); // Quản lý timeout

  const handlePlayPause = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const { clientWidth } = event.currentTarget;
      const clickX =
        event.clientX - event.currentTarget.getBoundingClientRect().left;
      const newTime = (clickX / clientWidth) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsSeeking(true);
    handleSeek(event);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isSeeking) {
      const progressBar = document.querySelector(".progress-bar");
      if (progressBar) {
        handleSeek({
          currentTarget: progressBar,
          clientX: event.clientX,
        } as any);
      }
    }
  };

  const handleMouseUp = () => {
    setIsSeeking(false);
  };

  // Hàm để thay đổi âm lượng
  const handleVolumeChange = (event: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const { clientHeight } = event.currentTarget;
      const clickY =
        event.clientY - event.currentTarget.getBoundingClientRect().top; // Tính toán từ trên xuống
      const newVolume = Math.min(1, Math.max(0, 1 - clickY / clientHeight)); // Đảm bảo âm lượng trong khoảng 0-1
      videoRef.current.volume = newVolume; // Cập nhật âm lượng video
      setVolume(newVolume); // Cập nhật trạng thái âm lượng
      setIsMuted(newVolume === 0); // Nếu âm lượng = 0, bật chế độ tắt tiếng
    }
  };

  // Hàm để xử lý sự kiện khi thả chuột lên thanh âm lượng
  const handleVolumeMouseUp = () => {
    document.removeEventListener("mousemove", handleVolumeMouseMove);
    document.removeEventListener("mouseup", handleVolumeMouseUp);
  };

  // Sự kiện khi nhấn chuột vào thanh âm lượng
  const handleVolumeMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    handleVolumeChange(event);
    document.addEventListener("mousemove", handleVolumeMouseMove);
    document.addEventListener("mouseup", handleVolumeMouseUp);
  };

  // Sự kiện khi di chuyển chuột trên thanh âm lượng
  const handleVolumeMouseMove = (event: MouseEvent) => {
    const volumeBar = document.querySelector(".volume-bar");
    if (volumeBar) {
      handleVolumeChange({
        currentTarget: volumeBar,
        clientY: event.clientY,
      } as any);
    }
  };

  // Hàm để chuyển đổi trạng thái tắt tiếng
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume; // Khôi phục âm lượng trước đó
      } else {
        videoRef.current.volume = 0; // Tắt tiếng
      }
      setIsMuted(!isMuted);
    }
  };

  const defaultVideoInfo: ThongTinVideo = {
    uploader: "Người tải lên không xác định",
    title: "Video không tiêu đề",
  };

  const info = videoInfo || defaultVideoInfo;

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSeeking]);

  // Handle volume bar hover
  const handleVolumeMouseEnter = () => {
    setIsVolumeHovered(true);
    if (volumeTimeout) {
      clearTimeout(volumeTimeout); // Clear any existing timeout
    }
  };

  const handleVolumeMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsVolumeHovered(false);
    }, 500); // 500 milliseconds delay
    setVolumeTimeout(timeout);
  };

  //Tự động phát
  useEffect(() => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [autoPlay]);

  return (
    <div
      className="video-container"
      style={{ height: "91vh", position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="video-player"
        loop
        playsInline
        onClick={handlePlayPause}
        style={{ width: "100%", height: "95%", objectFit: "cover" ,marginTop:'10%'}}
      />

      {/* Phần thông tin video */}
      <div
        className="video-info"
        style={{
          padding: "10px",
          color: "rgba(255,255,255,0.9)",
          position: "absolute",
          bottom: isHovered ? "10%" : "5%",
          left: "4%",
          transition: "bottom 0.3s ease",
        }}
      >
        <h3 style={{ margin: 0 }}>{info.uploader}</h3>
        <p style={{ margin: "5px 0" }}>{info.title}</p>
      </div>

      {/* Phần điều khiển */}
      <div
        className="video-controls"
        style={{
          width: "90%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          bottom: isHovered ? "5%" : "-10%",
          left: "5%",
          transition: "bottom 0.3s ease-in-out",
        }}
      >
        <Button
          type="link"
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "20px",
            padding: 3,
          }}
          icon={
            isPlaying ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )
          }
          size="large"
          onClick={handlePlayPause}
        />

        {/* Thanh tiến trình tùy chỉnh */}
        <div
          className="progress-bar"
          onMouseDown={handleMouseDown}
          style={{
            width: "70%",
            height: "5px",
            backgroundColor: "rgba(255,255,255,0.2)",
            position: "relative",
            cursor: "pointer",
            margin: "10px 0",
            borderRadius: "8px",
          }}
        >
          <div
            className="progress"
            style={{
              height: "100%",
              width: `${(currentTime / duration) * 100}%`,
              backgroundColor: "rgba(255,255,255,0.9)",
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Phần điều chỉnh âm lượng */}
        <div
          className="volume-container"
          onMouseEnter={handleVolumeMouseEnter}
          onMouseLeave={handleVolumeMouseLeave}
          style={{ position: "relative", cursor: "pointer", paddingLeft: 10 }}
        >
          <FontAwesomeIcon
            icon={isMuted ? faVolumeMute : faVolumeUp}
            onClick={toggleMute}
            style={{ color: "rgba(255,255,255,0.9)", fontSize: "20px" }}
          />

          {isVolumeHovered && (
            <div
              className="volume-bar"
              onMouseDown={handleVolumeMouseDown}
              style={{
                position: "absolute",
                bottom: "30px",
                left: "50%",
                width: "7px",
                height: "70px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >
                <div
                  className="volume-progress"
                  style={{
                    width: "100%",
                    height: `${volume * 100}%`,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortVideo;
