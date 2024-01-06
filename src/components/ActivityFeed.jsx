import React, { useEffect, useState } from "react";
import { getActivities, resetCalls, updateCall } from "../utils/apis.js";
import {
  CALL_DIRECTION,
  CALL_OUTCOME_MSSG,
  CALL_TYPES,
  NAVBAR_TABS,
  TABS,
} from "../utils/constants.js";
import "../css/activityFeed.css";
import Navbar from "./Navbar.jsx";
import ArrowIcon from "./ArrowIcon.jsx";
import CallInIcon from "./CallInIcon.jsx";
import CallOutIcon from "./CallOutIcon.jsx";
import ArchiveIcon from "./ArchiveIcon.jsx";
import UnarchiveIcon from "./UnarchiveIcon.jsx";

const ActivityFeed = () => {
  const [activeTab, setActiveTab] = useState(NAVBAR_TABS[0].id);
  const [activities, setActivities] = useState([]);
  const [openActivities, setOpenActivities] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAndOrganizeActivities();
  }, [activeTab]);

  const fetchAndOrganizeActivities = () => {
    setIsLoading(true);
    setOpenActivities({});
    getActivities()
      .then((res) => {
        const archivedActivities = [];
        const unarchivedActivities = [];
        let acount = 0;
        let uacount = 0;
        res.forEach((activity) => {
          const hasAllProperties =
            "id" in activity &&
            "created_at" in activity &&
            "direction" in activity &&
            "from" in activity &&
            "to" in activity &&
            "via" in activity &&
            "duration" in activity &&
            "is_archived" in activity &&
            "call_type" in activity;

          if (!hasAllProperties) {
            return;
          }
          if (activity.is_archived) {
            acount++;
            archivedActivities.push(activity);
            return;
          }
          uacount++;
          unarchivedActivities.push(activity);
        });
        console.log(acount, uacount);
        const activitiesToShow =
          activeTab === NAVBAR_TABS[0].id
            ? unarchivedActivities
            : archivedActivities;
        groupAndSortByDate(activitiesToShow);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const groupAndSortByDate = (activities) => {
    const groupedByDate = {};

    activities.forEach((activity) => {
      const date = new Date(activity.created_at);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      if (!groupedByDate[formattedDate]) {
        groupedByDate[formattedDate] = [];
      }
      activity.formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      groupedByDate[formattedDate].push(activity);
    });

    const sortedAndGroupedArray = Object.keys(groupedByDate).map((date) => {
      const sortedActivities = groupedByDate[date].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      return { date, activities: sortedActivities };
    });

    const sortedAndGroupedActivities = sortedAndGroupedArray.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setActivities(sortedAndGroupedActivities);
    setIsLoading(false);
  };

  const handleActivityClick = (id) => {
    setOpenActivities((prevOpenActivities) => {
      const updatedOpenActivities = Object.assign({}, prevOpenActivities);
      if (id in updatedOpenActivities) {
        updatedOpenActivities[id] = !updatedOpenActivities[id];
      } else {
        updatedOpenActivities[id] = true;
      }
      return updatedOpenActivities;
    });
  };

  const handleActivityUpdate = (e, id) => {
    e.stopPropagation();
    if (activeTab === NAVBAR_TABS[0].id) {
      archiveCall(id);
      return;
    }
    unarchiveCall(id);
  };

  const archiveCall = (id, updateList = true) => {
    setIsLoading(true);
    const updateBody = {
      is_archived: true,
    };
    updateCall(id, updateBody)
      .then((res) => {
        setIsLoading(false);
        if (updateList) {
          fetchAndOrganizeActivities();
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const unarchiveCall = (id) => {
    setIsLoading(true);
    const updateBody = {
      is_archived: false,
    };
    updateCall(id, updateBody)
      .then((res) => {
        setIsLoading(false);
        fetchAndOrganizeActivities();
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleAllActivitiesUpdate = () => {
    if (activeTab === NAVBAR_TABS[1].id) {
      resetAllCalls();
      return;
    }
    const archivePromises = [];
    activities.forEach((groupedActivities) =>
      groupedActivities.activities.forEach((activity) => {
        archivePromises.push(archiveCall(activity.id, false));
      })
    );
    setIsLoading(true);
    Promise.all(archivePromises)
      .then(() => {
        setTimeout(() => {
          setIsLoading(false);
          setActiveTab(NAVBAR_TABS[1].id);
        }, 500);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const resetAllCalls = () => {
    setIsLoading(true);
    resetCalls()
      .then((res) => {
        setActiveTab(NAVBAR_TABS[0].id);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="section-break"></div>
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        <div>
          {activities.length ? (
            <div
              className="all-activity-action-button"
              onClick={handleAllActivitiesUpdate}
            >
              {activeTab === NAVBAR_TABS[0].id ? "Archive" : "Unarchive"} all
              activities
            </div>
          ) : (
            <div></div>
          )}
          {!activities.length ? (
            <div className="empty-screen">No Activities</div>
          ) : (
            <div className="activity-container">
              {activities.map((groupedActivity, index) => (
                <div key={index}>
                  <p className="activity-date">{groupedActivity.date}</p>
                  {groupedActivity.activities.map((activity, ind) => (
                    <div
                      key={`${index}_${ind}`}
                      className="activity-box"
                      onClick={() => handleActivityClick(activity.id)}
                    >
                      <div className="activity-card-info">
                        {activity.direction === CALL_DIRECTION.INBOUND ? (
                          <CallInIcon width={23} height={23} />
                        ) : (
                          <CallOutIcon width={23} height={23} />
                        )}
                        <div className="call-info">
                          <p className="call-from">{activity.from}</p>
                          <p className="call-to">
                            {activity.call_type === CALL_TYPES.MISSED
                              ? CALL_OUTCOME_MSSG.MISSED
                              : activity.call_type === CALL_TYPES.VOICEMAIL
                              ? CALL_OUTCOME_MSSG.VOICEMAIL
                              : CALL_OUTCOME_MSSG.ANSWERED}{" "}
                            {activity.to}
                          </p>
                        </div>
                        <p className="call-time">{activity.formattedTime}</p>
                      </div>
                      {openActivities[activity.id] && (
                        <div className="call-details-box">
                          <div className="call-additional-info">
                            <p>
                              <span>Aircall No:</span> {activity.via}
                            </p>
                            <p>
                              <span>Duration:</span> {activity.duration}
                            </p>
                          </div>
                          <div
                            onClick={(e) =>
                              handleActivityUpdate(e, activity.id)
                            }
                          >
                            {activeTab === NAVBAR_TABS[0].id ? (
                              <ArchiveIcon />
                            ) : (
                              <UnarchiveIcon />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
