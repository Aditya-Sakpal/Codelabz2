import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Box, Chip, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ToggleButton from "@mui/lab/ToggleButton";
import ToggleButtonGroup from "@mui/lab/ToggleButtonGroup";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import User from "./UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { getUserProfileData } from "../../../store/actions";
import { HashLink } from "react-router-hash-link";
import { useParams } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { upVote, downVote } from "../../../store/actions";

const useStyles = makeStyles(() => ({
  container: {
    padding: "20px",
    boxSizing: "border-box"
  },
  settings: {
    flexWrap: "wrap",
    marginTop: "-10px",
    padding: "0 5px"
  },
  small: {
    padding: "10px"
  },
  chip: {
    marginLeft: "5px",
    fontWeight: "300",
    height: "20px"
  },
  bold: {
    fontWeight: "600"
  }
}));

const PostDetails = ({ details }) => {
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const [alignment, setAlignment] = useState("");
  const [isIncremented, setIsIncremented] = useState(false);
  const [isDecremented, setIsDecremented] = useState(false);
  const [incrementCount, setIncrementCount] = useState(details?.upVotes || 0);
  const [decrementCount, setDecrementCount] = useState(details?.downVotes || 0);


  const { id } = useParams();

  useEffect(() => {
    getUserProfileData(details.user)(firebase, firestore, dispatch);
  }, [details]);

  const user = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );

  const votedTutorials = useSelector(
    ({
      tutorials: {
        votes: { likedTutorials }
      }
    }) => likedTutorials
  );

  const getTime = timestamp => {
    return timestamp.toDate().toDateString();
  };

  const handleIncrement = async () => {
    if (isDecremented) {
      setDecrementCount(decrementCount - 1);
      setIsDecremented(false);
    }
    if (isIncremented) {
      setIncrementCount(incrementCount - 1);
      setIsIncremented(false);
    } else {
      setIncrementCount(incrementCount + 1);
      setIsIncremented(true);
    }
    await upVote(details?.tutorial_id)(firebase, firestore, dispatch);
  };

  const handleDecrement = async () => {
    if (isIncremented) {
      setIncrementCount(incrementCount - 1);
      setIsIncremented(false);
    }
    if (isDecremented) {
      setDecrementCount(decrementCount - 1);
      setIsDecremented(false);
    } else {
      setDecrementCount(decrementCount + 1);
      setIsDecremented(true);
    }
    await downVote(details?.tutorial_id)(firebase, firestore, dispatch);
  };
  const currentTutorialData = useSelector(
    ({
      tutorials: {
        current: { data }
      }
    }) => data
  );

  useEffect(()=>{
    console.log(currentTutorialData, "details")
  },[currentTutorialData])


  useEffect(() => {
    const val = votedTutorials?.find(t => t.tut_id === details?.tutorial_id)
    if (val?.value === 1) {
      setIsIncremented(true);
      setAlignment("left");
    } else if (val?.value === -1) {
      setIsDecremented(true);
      setAlignment("right");
    }
  }, [votedTutorials])
  
  const classes = useStyles();
  return (
    <>
      {details && (
        <Card className={classes.container}>
          <Grid>
            <Box>
              <Grid container columnSpacing={2} alignItems="center">
                <Grid item>
                  <Typography sx={{ fontWeight: "700", fontSize: "1.2rem" }}>
                    {details?.title}
                    {details?.tag?.map(tag => (
                      <Chip
                        label={tag}
                        variant="outlined"
                        className={classes.chip}
                      />
                    ))}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ width: "100%", marginTop: "10px" }}>
              <Grid container justifyContent="space-between" alignItems="end">
                <User
                  id={details?.user}
                  timestamp={details?.published_on}
                  showFollowButton={true}
                />

                <Grid item sx={{ width: "fit-content" }}>
                  <CardActions className={classes.settings} disableSpacing>
                    <ToggleButtonGroup
                      size="small"
                      className={classes.small}
                      exclusive
                      aria-label="text alignment"
                    >
                      <ToggleButton
                        className={classes.small}
                        onClick={handleIncrement}
                        value="left"
                        aria-label="left aligned"
                      >
                        <ThumbUpIcon style={{ color: isIncremented ? '#1977d3' : '' }} />
                        <span style={{ marginLeft: "5px" }} >{incrementCount}</span>
                      </ToggleButton>
                      <ToggleButton
                        className={classes.small}
                        onClick={handleDecrement}
                        value="right"
                        aria-label="right aligned"
                      >
                        <ThumbDownIcon style={{ color: isDecremented ? '#1977d3' : '' }} />
                        <span style={{ marginLeft: "5px" }} >{decrementCount}</span>
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <HashLink to={`/tutorial/${id}#comments`}>
                      <IconButton aria-label="share" data-testId="CommentIcon">
                        <ChatOutlinedIcon />
                      </IconButton>
                    </HashLink>
                    <IconButton
                      aria-label="add to favorites"
                      data-testId="ShareIcon"
                    >
                      <ShareOutlinedIcon />
                    </IconButton>
                    <IconButton aria-label="share" data-testId="NotifIcon">
                      <TurnedInNotOutlinedIcon />
                    </IconButton>
                    <IconButton aria-label="share" data-testId="MoreIcon">
                      <MoreVertOutlinedIcon />
                    </IconButton>
                  </CardActions>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Card>
      )}
    </>
  );
};

export default PostDetails;