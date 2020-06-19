import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles'


class Tasks extends Component {
  createTasks= item => {
  	return (
      

    <Card className="cardCls" key={item.key}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {item.task_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Priority: {item.priority}
          </Typography>

          <Typography variant="body2" color="textSecondary" component="p">
            Date: {item.date.toString().substring(0, 15)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={() => this.props.editItem(item.key)}>
          Edit
        </Button>
        <Button size="small" color="primary" onClick={() => this.props.deleteItem(item.key)}>
          Delete
        </Button>
      </CardActions>
    </Card>
    )
  }
  render() {
    const todoEntries = this.props.entries
    const listItems = todoEntries.map(this.createTasks)
    return <div className="">{listItems}</div>
  }
}
export default Tasks