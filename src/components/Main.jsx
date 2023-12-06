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
  font-size: ${(props) => (props.screenWidth < 1000 ? "0.9rem" : "1.1rem")};
`;
const InputField = styled.input`
  height: 3rem;
  font-size: 1.1rem;
  border-radius: 5px;
  padding: 0.3rem;
`;
const SelectField = styled.select`
  height: 3.8rem;
  font-size: 1.1rem;
  border-radius: 5px;
  padding: 0.3rem;
`;
const OptionField = styled.option`
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
  grid-template-columns: 1fr;
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
  const [city, setCity] = useState([]);

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  console.log(inputs)
  const currentDate = new Date();
  const currentDateTimeString = currentDate.toLocaleString(); // Lấy ngày và giờ dưới dạng chuỗi

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  // ... (other state variables)

  useEffect(() => {
    // Function to update the screenWidth state
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add an event listener to window resize and call the function
    window.addEventListener("resize", updateScreenWidth);

    // Call the function once on component mount
    updateScreenWidth();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  useEffect(() => {
    const getCity = async () => {
      try {
        const res = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setCity(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCity();
  },[]);

  const getJobs = async () => {
    try {
      const information = {
        title : inputs.title,
        address : inputs.address,
        salary : inputs.salary,
        experience : inputs.experience,
        level : inputs.level,
        refreshedTime: currentDateTimeString,
      };
      console.log(information);
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:5000/suggest-job",
        information,
        {
          params: { TvA: inputs.TvA, TvS: inputs.TvS, SvA: inputs.SvA },
          headers: {
            "Content-Type": "application/json", // Set the content type if needed
            "Access-Control-Allow-Origin": "*", // Your CORS header
            "Access-Control-Allow-Headers": "X-Requested-With", // Your CORS header
          },
        }
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
            <SelectField
              id="address"
              name="address"
              onChange={handleChange}
              defaultValue="0"
              screenWidth={screenWidth}
            >
              <OptionField value="0">
                Chọn tỉnh mà bạn muốn làm việc
              </OptionField>
              {city.map((city) => (
                <OptionField
                  key={city.id}
                  value={
                    city.name.split(" ")[city.name.split(" ").length - 2] +
                    " " +
                    city.name.split(" ")[city.name.split(" ").length - 1]
                  }
                >
                  {city.name.split(" ")[city.name.split(" ").length - 2] +
                    " " +
                    city.name.split(" ")[city.name.split(" ").length - 1]}
                </OptionField>
              ))}
            </SelectField>
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
            <SelectField
              id="TvS"
              name="TvS"
              onChange={handleChange}
              screenWidth={screenWidth}
            >
              <OptionField value={0}>
                Hãy chọn độ quan trọng Ngành so với lương
              </OptionField>
              <OptionField value={1}>Tương đương</OptionField>
              <OptionField value={4}>Quan trọng hơn</OptionField>
              <OptionField value={7}>Quan trọng hơn nhiều</OptionField>
            </SelectField>
            <LaybelField for="TvS">
              Mức độ ưu tiên Ngành muốn làm so với Lương
            </LaybelField>
          </GroupField>
          <GroupField>
            <InputField
              id="level"
              name="level"
              placeholder="VD: senior"
              onChange={handleChange}
            />
            <LaybelField screenWidth={screenWidth} for="level">
              Level
            </LaybelField>
          </GroupField>
          <GroupField>
            <SelectField
              id="TvA"
              name="TvA"
              onChange={handleChange}
              screenWidth={screenWidth}
            >
              <OptionField value={0}>
                Hãy chọn độ quan trọng Ngành so với Địa điểm công ty
              </OptionField>
              <OptionField value={1}>Tương đương</OptionField>
              <OptionField value={4}>Quan trọng hơn</OptionField>
              <OptionField value={7}>Quan trọng hơn nhiều</OptionField>
            </SelectField>
            <LaybelField screenWidth={screenWidth} for="TvA">
              Mức độ ưu tiên Ngành muốn làm so với Địa điểm công ty
            </LaybelField>
          </GroupField>
          <GroupField>
            <SelectField id="SvA" name="SvA" onChange={handleChange}>
              <OptionField value={0}>
                Hãy chọn độ quan trọng Tiền lương so với Địa điểm công ty
              </OptionField>
              <OptionField value={1}>Tương đương</OptionField>
              <OptionField value={4}>Quan trọng hơn</OptionField>
              <OptionField value={7}>Quan trọng hơn nhiều</OptionField>
            </SelectField>
            <LaybelField screenWidth={screenWidth} for="SvA">
              Mức độ ưu tiên Tiền lương so với Địa điểm công ty
            </LaybelField>
          </GroupField>
          <ButtonField onClick={handleSubmit}>Submit</ButtonField>
        </Info>
        {isFetch && (
          <Suggest>
            <Title>Suitable jobs for you :</Title>
            <SuggestInfo>
                <Item job={data[1]} score={data[0]} key={data[0].id} />
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
