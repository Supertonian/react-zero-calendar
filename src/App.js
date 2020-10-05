import React from "react";
import Calendar from "./components/calendar";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  header: {
    borderBottom: "1px solid #ccc",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.header}>캘린더</div>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item md={2}>
            <Paper className={classes.paper}>내 캘린더</Paper>
            <Paper className={classes.paper}>다른 캘린더</Paper>
          </Grid>
          <Grid item md>
            <Calendar />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default App;
