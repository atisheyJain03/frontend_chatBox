import axios from "axios";

// in this we are saving base url of page for api
export default axios.create({
  baseURL: "https://young-garden-40671.herokuapp.com",
  // baseURL: "http://localhost:8000",
});
