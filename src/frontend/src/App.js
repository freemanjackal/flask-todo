import React, {Component} from "react";
import "./App.css";
import TodoTasks from "./TodoTasks";
import Tasks from "./Tasks";
import axios from "axios";
import AuthTabs from "./tab";
import Cookies from "universal-cookie";
import PropTypes from "prop-types";
import url from "./config";

//const url = "http://localhost:5000";

class App extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      currentItem: {task_name: "", key: "", priority: "", date: ""},
      isLoggedIn: false,
      edit: false,
    };
  }
  inputElement = React.createRef();

  static get propTypes() {
    return {
      items: PropTypes.any,
      currentItem: PropTypes.object,
      isLoggedIn: PropTypes.bool,
      edit: PropTypes.bool,
    };
  }

  componentDidMount() {
    //const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTIzNDU4ODcsIm5iZiI6MTU5MjM0NTg4NywianRpIjoiY2EwMDllZjAtN2QwOS00ZTM2LTliNDUtNmYzNjMxOGUyNzI5IiwiZXhwIjoxNTkyOTUwNjg3LCJpZGVudGl0eSI6IjIiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.3uqwzolaKq1-hJ-3p_qo8Ixhr3DI0qsEKnic6QmY2zw'
    const cookies = new Cookies();
    const token = cookies.get("authToken");
    if (token === undefined) {
      console.log("undefined token");
      return;
    }
    this.setState({
      isLoggedIn: true,
    });

    axios
      .get(`${url}/api/v1/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        const items = res.data;
        console.log(items);
        const listItems = items.map(this.parseItems);
        this.setState({
          items: listItems,
        });
      });
  }

  handleInput = (e) => {
    e.preventDefault();

    const itemText = e.target.value;
    const currentItem = {
      task_name: itemText,
      key: this.state.currentItem.key,
      priority: this.state.currentItem.priority,
      date: this.state.currentItem.date,
      id: this.state.currentItem.key,
    };
    this.setState({
      currentItem,
    });
  };
  handleChangeDate = (date) => {
    const currentItem = {
      task_name: this.state.currentItem.task_name,
      key: this.state.currentItem.key,
      priority: this.state.currentItem.priority,
      date: date,
      id: this.state.currentItem.key,
    };
    this.setState({
      currentItem,
    });
  };
  deleteItem = (key) => {
    const cookies = new Cookies();
    const token = cookies.get("authToken");

    axios
      .delete(`${url}/api/v1/todos/${key}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          const filteredItems = this.state.items.filter((item) => {
            return item.key !== key;
          });
          this.setState({
            items: filteredItems,
            currentItem: {task_name: "", key: "", priority: "", date: ""},
            edit: false,
          });
        }
      });
  };

  editItem = (key) => {
    const item = this.state.items.filter((item) => {
      return item.key === key;
    });
    console.log(item);
    console.log(key);
    const currentItem = item[0];
    this.setState({
      currentItem: currentItem,
      edit: true,
    });
  };

  saveEdit = (e) => {
    //e.preventDefault()

    let newItem = this.state.currentItem;

    const cookies = new Cookies();
    const token = cookies.get("authToken");

    axios
      .put(`${url}/api/v1/todos/${newItem.id}`, newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.status === 201) {
          this.componentDidMount();

          this.setState({
            currentItem: {task_name: "", key: "", priority: "", date: ""},
            edit: false,
          });
        }
      });
  };

  cancel = () => {
    this.setState({
      currentItem: {task_name: "", key: "", priority: "", date: "", id: ""},
      edit: false,
    });
  };

  handlePriority = (e) => {
    //e.preventDefault();
    const priority = e.target.value;
    const currentItem = {
      task_name: this.state.currentItem.task_name,
      key: this.state.currentItem.key,
      priority: priority,
      date: this.state.currentItem.date,
      id: this.state.currentItem.key,
    };
    this.setState({
      currentItem,
    });
  };

  submit = (e) => {
    e.preventDefault();
  };

  parseItems = (item) => {
    item["key"] = item["id"];
    item["date"] = new Date(item["date"]);
    return item;
  };

  addItem = (e) => {
    //e.preventDefault()
    let newItem = this.state.currentItem;

    const cookies = new Cookies();
    const token = cookies.get("authToken");

    axios
      .post(`${url}/api/v1/todos`, newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        let tasks = res.data;
        const listItems = tasks.map(this.parseItems);
        console.log(listItems);
        this.setState({
          items: listItems,
          currentItem: {task_name: "", key: "", priority: "", date: ""},
        });
      });
  };
  loged = (isLoged) => {
    this.setState({
      isLoggedIn: isLoged,
    });

    this.componentDidMount();
  };
  logout = () => {
    const cookies = new Cookies();
    cookies.remove("authToken");
    this.setState({
      isLoggedIn: false,
      items: [],
    });
  };
  render() {
    return (
      <div className="App">
        {this.state.isLoggedIn ? (
          <div>
            <div>
              <a href=" " className="logout" onClick={this.logout}>
                Log out
              </a>
            </div>
            <br />
            <TodoTasks
              addItem={this.addItem}
              inputElement={this.inputElement}
              handleInput={this.handleInput}
              handleChangeDate={this.handleChangeDate}
              currentItem={this.state.currentItem}
              handlePriority={this.handlePriority}
              editFlag={this.state.edit}
              saveEdit={this.saveEdit}
              submit={this.submit}
              cancel={this.cancel}
            />

            <div className="SP">Created tasks</div>
            <Tasks
              entries={this.state.items}
              deleteItem={this.deleteItem}
              editItem={this.editItem}
            />
          </div>
        ) : (
          <div>
            <AuthTabs logged={this.loged} />
          </div>
        )}
      </div>
    );
  }
}
export default App;
