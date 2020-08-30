import React from "react";
import ReactDOM from "react-dom";
import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Formik, Form, Field } from "formik";

import "./styles.css";

function App() {
  let localStorageData = localStorage.getItem("foreignAddress"),
    retrivedData = JSON.parse(localStorageData);

  const handleNextClick = () => {
    console.log("clicked next");
  };

  const handleBackClick = () => {
    console.log("clicked back");
  };

  function Button(props) {
    const className = `button ${props.go}`;

    return (
      <button
        className={className}
        type={props.type}
        onClick={props.handleClick}
      >
        {props.label}
      </button>
    );
  }

  const nationality = [
    { code: "AF", label: "Afghanistan", phone: "93" },
    { code: "AD", label: "Andorra", phone: "376" },
    { code: "AG", label: "Antigua and Barbuda", phone: "1-268" },
    { code: "AI", label: "Anguilla", phone: "1-264" },
    { code: "AL", label: "Albania", phone: "355" },
    { code: "AM", label: "Armenia", phone: "374" },
    { code: "AO", label: "Angola", phone: "244" },
    { code: "AQ", label: "Antarctica", phone: "672" },
    { code: "AR", label: "Argentina", phone: "54" },
    { code: "AS", label: "American Samoa", phone: "1-684" }
  ];

  return (
    <div className="App">
      <div className="pages-wrapper address">
        <Formik
          initialValues={
            retrivedData
              ? retrivedData
              : {
                  streetName: "",
                  streetNumber: "",
                  postalCode: "",
                  city: "",
                  coAddress: "",
                  country: {
                    code: "",
                    label: "",
                    phone: ""
                  }
                }
          }
          onSubmit={data => {
            console.log(data);
            localStorage.setItem("foreignAddress", JSON.stringify(data));
            handleNextClick();
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Field
                    component={TextField}
                    name="streetName"
                    label="Street Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field
                    component={TextField}
                    name="streetNumber"
                    label="Street Number"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field
                    component={TextField}
                    name="postalCode"
                    label="Postal Code"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Field
                    component={TextField}
                    name="city"
                    label="City"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    name="coAddress"
                    label="C/O Address"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    id="foreignCountry"
                    className="country-select"
                    name="country"
                    options={nationality}
                    getOptionLabel={option => option.label}
                    value={values.country}
                    onChange={(e, value) => {
                      console.log(value);
                      setFieldValue("country", value);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        name="country"
                        label="Country"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <div className="button-wrapper">
                <Button label="Back" go="back" handleClick={handleBackClick} />
                <Button label="Next" go="next" type="submit" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
