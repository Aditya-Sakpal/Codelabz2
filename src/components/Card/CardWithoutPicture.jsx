import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Chip from "@mui/material/Chip";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ToggleButton from "@mui/lab/ToggleButton";
import ToggleButtonGroup from "@mui/lab/ToggleButtonGroup";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { getUserProfileData } from "../../store/actions";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { upVote, downVote } from "../../store/actions";
import { getVotedTutorials } from "../../store/actions";
// import { removeVote } from "../../store/actions";

import { set } from "lodash";
const useStyles = makeStyles(theme => ({
  root: {
    margin: "0.5rem",
    borderRadius: "10px",
    boxSizing: "border-box",
    [theme.breakpoints.down("md")]: {
      width: "auto"
    },
    [theme.breakpoints.down("xs")]: {
      width: "auto"
    }
  },
  grow: {
    flexGrow: 1
  },
  margin: {
    marginRight: "5px"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  inline: {
    fontWeight: 600
  },
  contentPadding: {
    padding: "0 16px"
  },
  icon: {
    padding: "5px"
  },
  time: {
    lineHeight: "1"
  },
  small: {
    padding: "10px"
  },
  settings: {
    flexWrap: "wrap"
  }
}));

export default function CardWithoutPicture({ tutorial }) {
  const classes = useStyles();
  const [alignment, setAlignment] = useState("left");
  const [isIncremented, setIsIncremented] = useState(false);
  const [isDecremented, setIsDecremented] = useState(false);
  const [incrementCount, setIncrementCount] = useState(tutorial?.upVotes || 0);
  const [decrementCount, setDecrementCount] = useState(tutorial?.downVotes || 0);
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const firestore = useFirestore();

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
    await upVote(tutorial?.tutorial_id)(firebase, firestore, dispatch);
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
    await downVote(tutorial?.tutorial_id)(firebase, firestore, dispatch);
  };

  useEffect(() => {
    if (tutorial?.value === 1) {
      setIsIncremented(true);
      setAlignment("left");
    } else if (tutorial?.value === -1) {
      setIsDecremented(true);
      setAlignment("right");
    }
  }, [])

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    const align = alignment === "right" ? "left" : "right";
    setAlignment(align)

  };
  useEffect(() => {
    getUserProfileData(tutorial?.created_by)(firebase, firestore, dispatch);
  }, [tutorial]);

  const user = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );

  const getTime = timestamp => {
    return timestamp.toDate().toDateString();
  };

  return (
    <Card className={classes.root} data-testId="codelabz">
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>
            {user?.photoURL && user?.photoURL.length > 0 ? (
              <img src={user?.photoURL} />
            ) : (
              user?.displayName[0]
            )}
          </Avatar>
        }
        title={
          <React.Fragment>
            <Typography
              component="span"
              variant="h7"
              className={classes.inline}
              color="textPrimary"
              data-testId="UserName"
            >
              {user?.displayName}
            </Typography>
            {tutorial?.owner && (
              <>
                {" for "}
                <Typography
                  component="span"
                  variant="h7"
                  className={classes.inline}
                  color="textPrimary"
                  data-testId="UserOrgName"
                >
                  {tutorial?.owner}
                </Typography>
              </>
            )}
          </React.Fragment>
        }
        subheader={tutorial?.createdAt ? getTime(tutorial?.createdAt) : ""}
      />
      <Link to={`/tutorial/${tutorial?.tutorial_id}`}>
        <CardContent
          className={classes.contentPadding}
          data-testId="codelabzDetails"
        >
          <Typography variant="h5" color="text.primary" data-testId="Title">
            {tutorial?.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            paragraph
            data-testId="Description"
          >
            {tutorial?.summary}
          </Typography>
        </CardContent>
      </Link>
      <CardActions className={classes.settings} disableSpacing>
        <Chip
          label="HTML"
          component="a"
          href="#chip"
          clickable
          variant="outlined"
          className={classes.margin}
        />
        <Typography
          variant="overline"
          display="block"
          className={classes.time}
          data-testId="Time"
        >
          {"10 min"}
        </Typography>
        <div className={classes.grow} />
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
        <IconButton aria-label="share" data-testId="CommentIcon">
          <ChatOutlinedIcon />
        </IconButton>
        <IconButton aria-label="add to favorites" data-testId="ShareIcon">
          <ShareOutlinedIcon />
        </IconButton>
        <IconButton aria-label="share" data-testId="NotifIcon">
          <TurnedInNotOutlinedIcon />
        </IconButton>
        <IconButton aria-label="share" data-testId="MoreIcon">
          <MoreVertOutlinedIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
