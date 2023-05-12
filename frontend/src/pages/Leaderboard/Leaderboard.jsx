import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../../api";
import Spinner from "../../components/shared/Spinner/Spinner";
import LeaderboardCard from "../../components/LeaderboardCard/LeaderboardCard";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await getLeaderboard();
      console.log(response.data.result[0].postedBy.avatarPath);

      if (response.status === 200) {
        setLeaderboard(response.data.result);
      }
    })();
  }, []);

  if (!leaderboard) {
    return <Spinner message="Loading the Leaderboard, please wait" />;
  }

  return (
    <div className="container">
      <div>
        {leaderboard.map((leader) => (
          <LeaderboardCard
            username={leader.postedBy.name}
            avatar={leader.postedBy.avatarPath}
            numStories={leader.storiesPosted}
            numUpVotes={leader.upVoteCount}
            key={leader.postedBy._id}
          />
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
