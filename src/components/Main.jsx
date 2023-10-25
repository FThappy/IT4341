import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Item from "./Item";

const Info = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  margin-left: 4rem;
  margin-right: 4rem;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  grid-column: 1/3;
`;

const LaybelField = styled.label`
  position: absolute;
  left: 2rem;
  top: -0.75rem;
  background-color: white;
  font-size: 1.2rem;
`;
const InputField = styled.input`
  height: 3rem;
  font-size: 1.1rem;
  border-radius: 5px;
  padding: 0.3rem;
`;
const ButtonField = styled.button`
  grid-column: 1/3;
  background-color: #33b249;
  color: whitesmoke;
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  height: 3rem;
`;
const GroupField = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Suggest = styled.div`
  margin-top: 2rem;
  margin-left: 4rem;
  margin-right: 4rem;
`;
const SuggestInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr ;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
  margin-left: 4rem;
  margin-right: 4rem;
  margin-bottom: 2rem;
`;
const Container = styled.div``;

const Main = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const [data, setData] = useState([]);
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const currentDate = new Date();
  const currentDateTimeString = currentDate.toLocaleString(); // Lấy ngày và giờ dưới dạng chuỗi


  const getJobs = async () => {
    try {
      const information = {
        ...inputs,
        refreshedTime: currentDateTimeString,
      };
      console.log(information);
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:5000/suggest-job",
        information
      );

      console.log(res.data);
      setIsLoading(false);
      setData(res.data);
      setIsFetch(true);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  const handleSubmit = () => {
    getJobs();
  };

  return (
    <Container>
      <>
        <Info>
          <Title>Enter your information here :</Title>
          <GroupField>
            <InputField
              id="title"
              name="title"
              placeholder="VD: Backend developer"
              onChange={handleChange}
            />
            <LaybelField for="title">Title</LaybelField>
          </GroupField>
          <GroupField>
            <InputField
              id="address"
              name="address"
              placeholder="VD: Thành Phố Hà Nội"
              onChange={handleChange}
            />
            <LaybelField for="address">Address</LaybelField>
          </GroupField>
          <GroupField>
            <InputField
              id="salary"
              name="salary"
              placeholder="VD: Thương lượng"
              onChange={handleChange}
            />
            <LaybelField for="salary">Salary</LaybelField>
          </GroupField>
          <GroupField>
            <InputField
              id="experience"
              name="experience"
              placeholder="VD: đại học, 2 năm kinh nghiệm"
              onChange={handleChange}
            />
            <LaybelField for="experience">Experience</LaybelField>
          </GroupField>
          <GroupField>
            <InputField
              id="typeofcompany"
              name="typeofcompany"
              placeholder="VD: Ngân Hàng"
              onChange={handleChange}
            />
            <LaybelField for="typeofcompany">Type Of Company</LaybelField>
          </GroupField>
          <GroupField>
            <InputField
              id="level"
              name="level"
              placeholder="VD: senior"
              onChange={handleChange}
            />
            <LaybelField for="level">Level</LaybelField>
          </GroupField>
          <GroupField>
            <InputField
              id="jobtype"
              name="jobtype"
              placeholder="VD: In Office"
              onChange={handleChange}
            />
            <LaybelField for="jobtype">Job Type</LaybelField>
          </GroupField>
          <GroupField>
            <InputField
              id="major"
              placeholder="VD:javascript reactjs nodejs"
              name="major"
              onChange={handleChange}
            />
            <LaybelField for="major">Major</LaybelField>
          </GroupField>
          <ButtonField onClick={handleSubmit}>Submit</ButtonField>
        </Info>
        {isFetch && (
          <Suggest>
            <Title>Suitable jobs for you :</Title>
            <SuggestInfo>
              {data.map((job) => (
                <Item job={job} key={job.id} />
              ))}
            </SuggestInfo>
          </Suggest>
        )}
      </>

      <Backdrop
        sx={{ color: "#ffff", backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
        <h1>.....Wait a few minutes ......</h1>
      </Backdrop>
    </Container>
  );
};

export default Main;
