import axios from "axios";

export default axios.create({
  baseURL: "https://young-garden-40671.herokuapp.com",
  // baseURL: "http://localhost:8000",
});
