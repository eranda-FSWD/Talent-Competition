import React, { Fragment } from "react";
import Cookies from "js-cookie";
import {
  Pagination,
  Icon,
  Popup,
  Card,
  Button,
  Label,
  Container,
} from "semantic-ui-react";
import moment from "moment";

export class JobSummaryCard extends React.Component {
  constructor(props) {
    super(props);
    this.selectJob = this.selectJob.bind(this);
  }

  selectJob(id) {
    var cookies = Cookies.get("talentAuthToken");
    var link =
      "https://talent-comp-eranda-talent.azurewebsites.net/listing/listing/closeJob";

    $.ajax({
      url: link,
      headers: {
        Authorization: "Bearer " + cookies,
        "Content-Type": "application/json",
      },
      type: "POST",
      data: JSON.stringify(id),
      contentType: "application/json",
      dataType: "json",
      success: function(res) {
        alert(res.message, "success");
      }.bind(this),
      error: function(res) {
        console.log(res.status);
      },
    });
  }

  render() {
    const { loadJobs, activePage, totalPages, onPageSelection } = this.props;

    if (loadJobs.length === 0) {
      return (
        <Fragment>
          <Container>
            <p>There are No Jobs</p>
          </Container>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Container>
            <Card.Group centered>
              {loadJobs.map((j) => (
                <Card key={j._id}>
                  <Card.Content>
                    <Card.Header>{j.title}</Card.Header>
                    <Label color="black" ribbon="right">
                      <Icon name="user" />0
                    </Label>
                    <Card.Meta>
                      <span className="date">
                        {j.location.country},{j.location.city}
                      </span>
                    </Card.Meta>
                    <Card.Description>{j.summary}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button size="mini" color="red">
                      Expired
                    </Button>
                    <Button.Group size="mini" floated="right">
                      <Button
                        basic
                        color="blue"
                        id={j.id}
                        onClick={() => this.selectJob(j.id)}
                      >
                        Close
                      </Button>
                      <Button
                        basic
                        color="blue"
                        id={j.id}
                        href={`/EditJob/${j.id}`}
                      >
                        Edit
                      </Button>
                      <Button basic color="blue">
                        Copy
                      </Button>
                    </Button.Group>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
            <div floated="right">
              <Pagination
                boundaryRange={0}
                defaultActivePage={activePage}
                siblingRange={1}
                totalPages={totalPages}
                onPageChange={onPageSelection}
              />
            </div>
          </Container>
        </Fragment>
      );
    }
  }
}
