import React from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import LoggedInBanner from "../../Layout/Banner/LoggedInBanner.jsx";
import { LoggedInNavigation } from "../../Layout/LoggedInNavigation.jsx";
import { JobSummaryCard } from "./JobSummaryCard.jsx";
import { BodyWrapper, loaderData } from "../../Layout/BodyWrapper.jsx";
import {
  Pagination,
  Icon,
  Dropdown,
  Checkbox,
  Accordion,
  Form,
  Card,
  Segment,
} from "semantic-ui-react";

export default class ManageJob extends React.Component {
  constructor(props) {
    super(props);
    let loader = loaderData;
    loader.allowedUsers.push("Employer");
    loader.allowedUsers.push("Recruiter");
    //console.log(loader)
    this.state = {
      loadJobs: [],
      loaderData: loader,
      activePage: 1,
      sortBy: {
        date: "desc",
      },
      filter: {
        showActive: true,
        showClosed: true,
        showDraft: false,
        showExpired: true,
        showUnexpired: true,
      },
      totalPages: 1,
      activeIndex: "",
    };
    this.loadData = this.loadData.bind(this);
    this.init = this.init.bind(this);
    this.loadNewData = this.loadNewData.bind(this);
    //your functions go here
    this.toggleSortBySelection = this.toggleSortBySelection.bind(this);
    this.toggleFilterSelection = this.toggleFilterSelection.bind(this);
    this.onPageSelection = this.onPageSelection.bind(this);
  }

  init() {
    let loaderData = TalentUtil.deepCopy(this.state.loaderData);
    loaderData.isLoading = false;
    //this.setState({ loaderData }); //comment this

    //set loaderData.isLoading to false after getting data
    this.loadData(() => this.setState({ loaderData }));

    //console.log(this.state.loaderData);
  }

  componentDidMount() {
    this.init();
  }

  loadData(callback) {
    var link =
      "https://talent-comp-eranda-talent.azurewebsites.net/listing/listing/getSortedEmployerJobs";
    var cookies = Cookies.get("talentAuthToken");
    // your ajax call and other logic goes here
    $.ajax({
      url: link,
      headers: {
        Authorization: "Bearer " + cookies,
        "Content-Type": "application/json",
      },
      type: "GET",
      data: {
        activePage: this.state.activePage,
        sortbyDate: this.state.sortBy.date,
        showActive: this.state.filter.showActive,
        showClosed: this.state.filter.showClosed,
        showDraft: this.state.filter.showDraft,
        showExpired: this.state.filter.showExpired,
        showUnexpired: this.state.filter.showUnexpired,
      },
      contentType: "application/json",
      dataType: "json",
      success: function(res) {
        this.setState(
          {
            loadJobs: res.myJobs,
            totalPages: Math.ceil(res.totalCount / 6),
          },
          callback()
        );
      }.bind(this),
      error: function(res) {
        console.log(res.status);
      },
    });
  }

  loadNewData(data) {
    var loader = this.state.loaderData;
    loader.isLoading = true;
    data[loaderData] = loader;
    this.setState(data, () => {
      this.loadData(() => {
        loader.isLoading = false;
        this.setState({
          loadData: loader,
        });
      });
    });
  }

  onPageSelection(event, p) {
    const data = Object.assign({}, this.state);
    data["activePage"] = p.activePage;
    this.setState({
      activePage: data.activePage,
    });
    this.loadNewData(data);
  }

  toggleFilterSelection(event, data) {
    const filter = Object.assign({}, this.state);
    filter[data.label] = !this.state.filter[data.label];
    this.setState({ filter });

    this.init();

    //this.loadNewData(filter);
  }

  toggleSortBySelection(event, data) {
    const sortBy = Object.assign({}, this.state);
    sortBy.date = data.value;
    this.setState({ sortBy });

    this.init();
    //this.loadNewData(sortBy);
  }

  render() {
    const sortby = [
      { id: 1, text: "Newest first", value: "desc" },
      { id: 2, text: "Oldest first", value: "asce" },
    ];
    const filters = [
      { id: 1, text: "showActive", value: "showActive" },
      { id: 2, text: "showClosed", value: "showClosed" },
      { id: 3, text: "showDraft", value: "showDraft" },
      { id: 4, text: "showExpired", value: "showExpired" },
      { id: 5, text: "showUnexpired", value: "showUnexpired" },
    ];
    return (
      <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
        <div className="ui container">
          <h1>List of Jobs</h1>
          <span>
            <Icon name="filter" />
            <Dropdown
              multiple
              inline
              item
              simple
              text="Filter: Choose Filter"
              options={filters.map((c) => (
                <Dropdown.Item key={c.id}>
                  <Checkbox
                    label={c.text}
                    defaultChecked={this.state.filter[c.value]}
                    onChange={this.toggleFilterSelection}
                  />
                </Dropdown.Item>
              ))}
            />
          </span>
          <span>
            <Icon name="calendar alternate" />
            <Dropdown
              inline
              item
              simple
              text="Sort by date: "
              options={sortby}
              defaultChecked={sortby[0].value}
              onChange={this.toggleSortBySelection}
            />
          </span>
        </div>
        <br />
        <JobSummaryCard
          loadJobs={this.state.loadJobs}
          totalPages={this.state.totalPages}
          activePage={this.state.activePage}
          onPageSelection={this.onPageSelection}
        />
      </BodyWrapper>
    );
  }
}
