import React, { useState, useEffect } from "react";
import { getEngagements } from "../../api";
import Spinner from "../../components/shared/Spinner/Spinner";
import EngagementCard from "../../components/EngagementCard/EngagementCard";
import styles from "./Engagements.module.css";

function Engagements() {
  const [yourEngagements, setYourEngagements] = useState(null);
  const [othersEngagements, setOthersEngagements] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await getEngagements();
      if (response.status === 200) {
        const yourData = response.data.you;
        const othersData = response.data.others;

        const yourDataFiltered = yourData.filter(
          (obj) => !Object.values(obj).includes(null)
        );
        const othersDataFiltered = othersData.filter(
          (obj) => !Object.values(obj).includes(null)
        );

        setYourEngagements(yourDataFiltered);
        setOthersEngagements(othersDataFiltered);
      }
    })();
  }, []);

  if (!yourEngagements)
    return <Spinner message="Loading engagements, please wait" />;

  return (
    <div className="container">
      <h3 className={styles.engagementHeader}>Your activity</h3>
      <div>
        {yourEngagements.map((engagement) => (
          <EngagementCard
            username="You"
            storyId={engagement.onPost._id}
            action={engagement.action}
            goal={engagement.forUser.name}
            date={engagement.createdAt}
          />
        ))}
      </div>
      <h3 className={styles.engagementHeader}>Others actvity</h3>
      <div>
        {othersEngagements.map((engagement) => (
          <EngagementCard
            username={engagement.byUser.name}
            storyId={engagement.onPost._id}
            action={engagement.action}
            goal="you"
            date={engagement.createdAt}
          />
        ))}
      </div>
    </div>
  );
}

export default Engagements;
