import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavBar from "./NavBar";
import { fetchApplicants } from "../slices/applicantsSlice";

function Applicants(props) {
  const applicants = useSelector((state) => state.applicants.list);
  const loading = useSelector((state) => state.applicants.loading);
  const error = useSelector((state) => state.applicants.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchApplicants());
  }, [dispatch]);
    
  return (
    <div>
      <NavBar/>
      <h2>Applicants:</h2>
      {loading &&  <p>Loading...</p>}
      {error && <p style = {{ color: "red"}} > Error: {error}</p>}
        
      <ul>
        {applicants.map((a) => (
          <li key={a.id || a.email}>{a.name}</li>
        ))}
      </ul>
      <h2>Passed Prop: {props.name}</h2>
    </div>
  );
}
  
export default Applicants;
