import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VideoStory.module.css";
import Button from "../../shared/Button/Button";
import { createVideoStory } from "../../../api";
import { globalContext } from "../../../context/globalContext";

function VideoStory() {
  const videoPlaceholderImage = "/images/default-video-story.png";

  const [hover, setHover] = useState(false);

  const {
    isPrivate,
    onPrevHandler,
    clearContext,
    caption,
    setCaption,
    video,
    setVideo,
    videoPreview,
    setVideoPreview,
  } = useContext(globalContext);

  const navigate = useNavigate();

  const createStoryHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("video", video);

    formData.append("caption", caption);
    formData.append("mediaType", "video");
    formData.append("isPrivate", isPrivate);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    const response = await createVideoStory(formData, config);

    if (response.status === 201) {
      onPrevHandler(); // reset the create story form to step 1
      navigate("/");
    }
    clearContext();
  };

  return (
    <form onSubmit={createStoryHandler}>
      <div className={styles.cardFlex}>
        <div className={styles.videoPromptHeading}>
          <span className={styles.videoWrapper}>
            {video === "" ? (
              <img
                src={videoPlaceholderImage}
                alt="video-placeholder"
                className={styles.video}
              />
            ) : (
              <video
                src={videoPreview}
                controls
                autoPlay
                loop
                muted
                className={styles.video}
              />
            )}
          </span>

          <span className={styles.videoLabelWrapper}>
            <input
              className={styles.videoSelection}
              type="file"
              name="video"
              accept="video/*"
              id="videoSelectionInput"
              onChange={(e) => {
                setVideo(e.target.files[0]);
                setVideoPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />

            <label className={styles.videoLabel} htmlFor="videoSelectionInput">
              Choose video
            </label>
          </span>
        </div>
      </div>
      <textarea
        className={styles.caption}
        placeholder="Caption"
        maxLength={200}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Button
        buttontitle="Post"
        buttonimage="party_popper"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ backgroundColor: hover ? "#444" : "#777" }}
        type="submit"
        disabled={video === ""}
      />
    </form>
  );
}

export default VideoStory;
