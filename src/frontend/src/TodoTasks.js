import React, {Component} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Button, TextField} from "@material-ui/core";

import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

class TodoTasks extends Component {
  static get propTypes() {
    return {
      submit: PropTypes.func,
      currentItem: PropTypes.object,
      isLoggedIn: PropTypes.bool,
      handleInput: PropTypes.func,
      handlePriority: PropTypes.func,
      handleChangeDate: PropTypes.func,
      editFlag: PropTypes.bool,
      saveEdit: PropTypes.func,
      cancel: PropTypes.func,
      addItem: PropTypes.func,
      inputElement: PropTypes.node,
    };
  }

  componentDidUpdate() {
    this.props.inputElement.current.focus();
  }

  classes() {
    return useStyles();
  }
  render() {
    return (
      <form onSubmit={this.props.submit} noValidate autoComplete="off">
        <div>
          <TextField
            id="outlined-error-helper-text"
            label="Task name"
            variant="outlined"
            placeholder="Task name"
            ref={this.props.inputElement}
            value={this.props.currentItem.task_name}
            onChange={this.props.handleInput}
          />
        </div>
        <br />
        <div>
          <TextField
            id="outlined-error-helper-text"
            label="Task priority"
            variant="outlined"
            placeholder="Task priority"
            value={this.props.currentItem.priority}
            onChange={this.props.handlePriority}
            type="number"
          />
        </div>
        <br />
        <div>
          <DatePicker
            className="dateC"
            selected={this.props.currentItem.date}
            dateFormat="yyyy-MM-dd"
            onChange={this.props.handleChangeDate}
            variant="outlined"
          />
        </div>
        <br />
        <div>
          {this.props.editFlag ? (
            <>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => this.props.saveEdit()}
              >
                Edit task
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.props.cancel()}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.props.addItem()}
            >
              Add task
            </Button>
          )}
        </div>
      </form>
    );
  }
}
export default TodoTasks;
