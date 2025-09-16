import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAll } from "../actions/store";
import NavBar from "./NavBar";
import { auth } from "../api";


function Applicants(props) {
  const handleGenerateApplicant = async () => {
    const applicantPayload = {
      name: "New Applicant",
      email: "newapplicant@example.com"
    };
    const res = await axios.api.post("/applicants", applicantPayload); // create applicant
  };
  const applicant = useSelector((state) => state.applicants.applicants);
  const loading = useSelector((state) => state.applicants.loading);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.applicants.error);
    useEffect(() => {
      dispatch(fetchAll());
    }, [dispatch]);
    
  return (
    <div>
      <NavBar/>
      <h2>Applicants:</h2>
      {loading &&  // Display loading message while fetching data
        <p>Loading...</p>}
        {error && <p style = {{ color: "red"}} > Error: {error}</p>}
        
        <ul>
          {applicant.map((a) => (
            <li key={a.id}>{a.name}</li>  // Assuming each applicant has a `name`
          ))}
        </ul>
      <h2>Passed Prop: {props.name}</h2>
    </div>
  );
}
  
export default Applicants;