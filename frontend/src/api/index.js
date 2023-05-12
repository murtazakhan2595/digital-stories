import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_PATH,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Headers": "X-UserSession",
  },
});

export const registerUser = async (data) => {
  let response;
  try {
    response = await api.post("users/signup", {
      name: data.name,
      // username: data.username,
      password: data.password,
      passwordConfirm: data.password,
      email: data.email,
      avatarPath: data.avatar,
    });
  } catch (error) {
    return error;
  }
  return response;
};

export const login = async (data) => {
  let response;
  try {
    response = await api.post("users/login", {
      email: data.email,
      password: data.password,
    });
  } catch (error) {
    return error;
  }
  return response;
};

export const getCurrentUser = async () => {
  let response;
  try {
    response = await api.get("/api/me");
  } catch (error) {
    return error;
  }
  return response;
};

// https://stackoverflow.com/a/44806250
export const logout = async () => api.post("users/logout");

export const getAllStories = async (page) => api.get(`stories?page=${page}`);

export const getMyStories = async (page) =>
  api.get(`stories/myStories?page=${page}`);

export const getTrendingStories = async () => api.get("stories/trending");

export const getStoryById = async (id) => api.get(`stories/${id}`);

export const createStory = async (story) => {
  let response;

  if (story.mediaType === "text") {
    try {
      const { mediaType, caption, font, fontColor, isPrivate } = story;
      response = await api.post("stories/", {
        mediaType,
        caption,
        font,
        fontColor,
        isPrivate,
      });
    } catch (error) {
      return error;
    }
    return response;
  }

  if (story.mediaType === "image") {
    try {
      const { mediaType, caption, image, isPrivate } = story;
      response = await api.post("stories/", {
        mediaType,
        caption,
        image,
        isPrivate,
      });
    } catch (error) {
      return error;
    }
    return response;
  }

  return response;
};

export const createVideoStory = async (data, config) => {
  let response;
  try {
    response = await api.post("stories/video", data, config);
  } catch (error) {
    return error;
  }
  return response;
};

export const updateVideoStory = async (data, config) => {
  let response;
  try {
    response = await api.put("stories/video", data, config);
  } catch (error) {
    return error;
  }
  return response;
};

export const updateStory = async (story) => {
  let response;

  if (story.mediaType === "text") {
    try {
      const { mediaType, caption, font, fontColor, storyId } = story;
      response = await api.put("stories", {
        mediaType,
        caption,
        font,
        fontColor,
        storyId,
      });
    } catch (error) {
      return error;
    }
    return response;
  }

  if (story.mediaType === "image") {
    try {
      const { mediaType, caption, image, storyId } = story;
      response = await api.put("stories", {
        mediaType,
        caption,
        image,
        storyId,
      });
    } catch (error) {
      return error;
    }
    return response;
  }

  return response;
};

export const updateStoryAccessMode = async (storyId, isPrivate) => {
  const response = await api.put("stories/mode", {
    storyId,
    isPrivate,
  });

  return response;
};

export const createComment = async (data) => {
  let response;
  try {
    const { text, story } = data;
    response = await api.post("comments", { text, story });
  } catch (error) {
    return error;
  }
  return response;
};

export const upVoteStory = async (data) => {
  let response;
  try {
    const { post, postedBy } = data;
    response = await api.post("votes/upvote", { post, postedBy });
  } catch (error) {
    return error;
  }
  return response;
};

export const downVoteStory = async (data) => {
  let response;
  try {
    const { post, postedBy } = data;
    response = await api.post("votes/downvote", { post, postedBy });
  } catch (error) {
    return error;
  }
  return response;
};

export const getCommentsByPostId = async (id) => {
  let response;
  try {
    response = await api.get(`comments/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};

export const deletePostById = async (id) => api.delete(`stories/${id}`);

export const getVoteStatus = async (post) =>
  api.post("votes/vote-status/", { post });

export const getNumUsers = async () => api.get("users/num-users");

export const getLeaderboard = async () => api.get("leaderboard/");

export const getEngagements = async () => api.get(`engagements/`);

// interceptor for auto token refresh
// api.interceptors.response.use(
//   (config) => config,
//   // eslint-disable-next-line consistent-return
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response.status === 401 &&
//       originalRequest &&
//       !originalRequest._isRetry
//     ) {
//       originalRequest.isRetry = true;

//       try {
//         await axios.get(`${process.env.REACT_APP_API_PATH}/api/refresh`, {
//           withCredentials: true,
//         });

//         return api.request(originalRequest);
//       } catch (err) {
//         return err;
//       }
//     }
//   }
// );
// Add a request interceptor

export default api;
